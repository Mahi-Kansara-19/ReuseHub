const Demand = require("../models/Demand");
const WasteListing = require("../models/WasteListing");
const Match = require("../models/Match");

const { calculateMatchScore, runMatching } = require("../services/matchingService");


// Generate AI matches for logged-in buyer
const generateMatches = async (req, res) => {
  try {
    const buyerId = req.user._id;

    console.log("Generating matches for:", buyerId);

    const demands = await Demand.find({
      buyer: buyerId,
      status: "open",
    });

    const listings = await WasteListing.find({
      availability: { $regex: /^available$/i },
    });

    console.log("Demands found:", demands.length);
    console.log("Listings found:", listings.length);

    let createdMatches = [];

    for (const demand of demands) {
      for (const listing of listings) {

        const result = calculateMatchScore(demand, listing);

        if (result.score >= 60) {

          const existingMatch = await Match.findOne({
            buyer: buyerId,
            demand: demand._id,
            listing: listing._id,
          });

          if (!existingMatch) {
            const newMatch = await Match.create({
              buyer: buyerId,
              supplier: listing.owner,
              demand: demand._id,
              listing: listing._id,
              matchScore: result.score,
              matchReason: result.reasons,
              status: "new",
            });

            createdMatches.push(newMatch);

            console.log("✅ Match Created");
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      count: createdMatches.length,
      matches: createdMatches,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error generating matches",
      error: error.message,
    });
  }
};



// Get matches only for logged-in buyer
const getMatchesForBuyer = async(req,res)=>{

    try{


        const buyerId=req.user._id;

        // Run the matching system locally to generate any new matches
        await runMatching();

      const matches = await Match.find({
    buyer: buyerId
})
.populate("buyer", "businessName ownerName email phone location")
.populate("supplier","businessName ownerName email phone location")
.populate("listing")
.populate("demand");

      const verifiedMatches = [];
      for (const m of matches) {
        if (!m.listing || !m.buyer || !m.supplier || (m.demandId && !m.demand)) {
          await Match.findByIdAndDelete(m._id);
          console.log(`[CASCADING CLEANUP] Automatically deleted orphaned match ${m._id} due to missing references.`);
        } else {
          verifiedMatches.push(m);
        }
      }

        res.status(200).json({

            success:true,

            count:verifiedMatches.length,

            matches: verifiedMatches

        });



    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};


const createManualMatch = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { listingId } = req.body;

    const listing = await WasteListing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const existing = await Match.findOne({
      buyer: buyerId,
      listing: listingId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Request already sent.",
      });
    }

    const match = await Match.create({
        
      buyer: buyerId,
      supplier: listing.owner,
      listing: listing._id,

      // manual request
      demand: null,
      matchScore: 100,
      matchReason: ["Manual request from Marketplace"],

      status: "pending",
    });
    console.log("Created Match:", match);
    

    res.status(201).json({
      success: true,
      match,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



// Update match status
const updateMatchStatus = async(req,res)=>{

    try{


        const {status}=req.body;


        const match =
        await Match.findById(
            req.params.id
        );


        if(!match){

            return res.status(404).json({

                message:"Match not found"

            });

        }


        // Only allow valid statuses from our flow
        if (!["pending", "accepted_by_supplier", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status value"
            });
        }


        match.status = status;


        await match.save();



        res.status(200).json({

            success:true,

            match

        });


    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};


const getMatchesForSupplier = async (req, res) => {
  try {
    const supplierId = req.user._id;
    console.log("Supplier ID:", supplierId);

    const matches = await Match.find({
      supplier: supplierId,
      status: { $in: ["new", "pending", "accepted_by_supplier", "rejected"] }
    })
    .populate("buyer", "businessName ownerName email phone location")
    .populate("supplier", "businessName ownerName email phone location")
    .populate("listing")
    .populate("demand")
    .sort({ createdAt: -1 });

    const verifiedMatches = [];
    for (const m of matches) {
      if (!m.listing || !m.buyer || !m.supplier || (m.demandId && !m.demand)) {
        await Match.findByIdAndDelete(m._id);
        console.log(`[CASCADING CLEANUP] Automatically deleted orphaned match ${m._id} due to missing references.`);
      } else {
        verifiedMatches.push(m);
      }
    }

    res.json({
      success: true,
      matches: verifiedMatches,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports={
    generateMatches,
    getMatchesForBuyer,
    updateMatchStatus,
    getMatchesForSupplier,
    createManualMatch,
};