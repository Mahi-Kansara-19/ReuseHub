import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  MapPin,
  Layers,
  Weight,
  MessageSquare,
  X,
  CheckCircle,
  SlidersHorizontal,
  Plus,
  Inbox,
  Calendar,
  Trash2,
  Edit
} from "lucide-react";


import {
  getAllWasteListings,
  getMyWasteListings,
  deleteWasteListing
} from "../services/wasteService";


import { mockDataService } from "../services/mockData";



const Listings = () => {
const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();


  const token = localStorage.getItem("token");



  // ===============================
  // STATES
  // ===============================


  const [listings, setListings] = useState([]);


  const [viewMode, setViewMode] = useState("all");



  const [search, setSearch] = useState("");


  const [selectedCategory, setSelectedCategory] = useState("All");


  const [selectedLocation, setSelectedLocation] = useState("");


  const [selectedPrice, setSelectedPrice] = useState("All");


  const [sortBy, setSortBy] = useState("newest");



  const [contactModal, setContactModal] = useState({
    open: false,
    listing: null
  });



  const [messageText, setMessageText] = useState("");



  const [alert, setAlert] = useState({
    show:false,
    message:"",
    type:"success"
  });





  // ===============================
  // CATEGORIES
  // ===============================


  const categories = [

    "All",
"Cafe and Restaurant",
    "Plastic Waste",
  "Paper Waste",
  "Metal Waste",
  "Glass Waste",
  "E-Waste",
  "Textile Waste",
  "Food Waste",
  "Wood Waste",
  "Rubber Waste",
  "Construction Waste",
  "Chemical Waste",
  "Printing Shop",
  "Packaging Waste",
  "Flower Waste",
  "Agricultural Waste",
  "Other",

  ];






  // ===============================
  // INITIAL LOAD
  // ===============================


  const loadListings = async(mode="all")=>{


    try{


      let data=[];



      if(mode==="my"){


        data = await getMyWasteListings();


      }
      else{


        data = await getAllWasteListings();


      }



      setListings(data);



    }
    catch(error){


      console.error(
        "Loading listings failed:",
        error
      );


      setListings([]);


    }


  };






  useEffect(()=>{


    loadListings("all");


  }, []);







  // ===============================
  // CHANGE VIEW
  // ===============================


  const changeView=(mode)=>{


    setViewMode(mode);


    loadListings(mode);


  };






  // ===============================
  // CONTACT SUPPLIER
  // ===============================


  const handleContact=(listing)=>{


    if(!token){


      navigate("/get-started");


      return;


    }



    setContactModal({

      open:true,

      listing

    });



    setMessageText(

      `Hello, we are interested in your waste listing "${listing.name}". Please share availability and pickup details.`

    );


  };







  // ===============================
  // SEND MESSAGE
  // ===============================


  const submitMessage=(e)=>{


    e.preventDefault();



    if(!messageText.trim())

      return;





    mockDataService.sendMessage({


      listingId:
      contactModal.listing._id,



      listingName:
      contactModal.listing.name,



      supplierBusiness:
      contactModal.listing.businessName,



      message:
      messageText


    });




    setContactModal({

      open:false,

      listing:null

    });




    setMessageText("");




    setAlert({

      show:true,

      message:"Proposal sent successfully",

      type:"success"

    });




    setTimeout(()=>{


      setAlert({

        show:false,

        message:"",

        type:"success"

      });



    },3000);



  };

  




  // ===============================
  // DELETE MY LISTING
  // ===============================


  const handleDelete = async(id)=>{


    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );


    if(!confirmDelete)

      return;




    try{


      await deleteWasteListing(id);



      loadListings("my");



      setAlert({

        show:true,

        message:"Listing deleted successfully",

        type:"success"

      });



    }
    catch(error){


      console.error(
        "Delete failed:",
        error
      );


    }


  };







  // ===============================
  // PRICE PARSER
  // ===============================


  const parsePrice=(price)=>{


    if(!price)

      return 0;



    if(price.toLowerCase()==="free")

      return 0;



    const value = price.match(/\d+/);



    return value

      ? Number(value[0])

      : 0;


  };







  // ===============================
  // FILTER AND SORT LISTINGS
  // ===============================


  const filteredListings = listings

  .filter((item)=>{


    const text = search.toLowerCase();



    const matchesSearch =

      item.name?.toLowerCase().includes(text)

      ||

      item.businessName?.toLowerCase().includes(text)

      ||

      item.description?.toLowerCase().includes(text);





    const matchesCategory =

      selectedCategory==="All"

      ||

      item.category===selectedCategory;





    const matchesLocation =

      !selectedLocation

      ||

      item.location
      ?.toLowerCase()
      .includes(
        selectedLocation.toLowerCase()
      );





    const isFree =

      item.price?.toLowerCase()==="free";





    const matchesPrice =

      selectedPrice==="All"

      ||

      (selectedPrice==="Free" && isFree)

      ||

      (selectedPrice==="Paid" && !isFree);





    return (

      matchesSearch

      &&

      matchesCategory

      &&

      matchesLocation

      &&

      matchesPrice

    );


  })



  .sort((a,b)=>{


    if(sortBy==="newest"){


      return new Date(b.createdAt)

      -

      new Date(a.createdAt);


    }




    if(sortBy==="oldest"){


      return new Date(a.createdAt)

      -

      new Date(b.createdAt);


    }




    if(sortBy==="price-asc"){


      return parsePrice(a.price)

      -

      parsePrice(b.price);


    }




    if(sortBy==="price-desc"){


      return parsePrice(b.price)

      -

      parsePrice(a.price);


    }




    if(sortBy==="quantity-desc"){


      return Number(b.quantity)

      -

      Number(a.quantity);


    }



    return 0;



  });







  return (


    <div className="
    max-w-7xl 
    mx-auto 
    px-4 
    sm:px-6 
    lg:px-8 
    py-10
    ">



      {/* ALERT MESSAGE */}


      <AnimatePresence>


      {

        alert.show && (


          <motion.div

          initial={{
            opacity:0,
            y:-20
          }}


          animate={{
            opacity:1,
            y:0
          }}


          className="
          mb-6
          p-4
          bg-emerald-50
          border
          border-emerald-200
          rounded-xl
          text-emerald-700
          font-semibold
          "

          >


            <CheckCircle 
              className="
              inline 
              h-5 
              w-5 
              mr-2
              "
            />


            {alert.message}


          </motion.div>


        )


      }


      </AnimatePresence>







      {/* HEADER */}


      <div className="
      flex 
      flex-col 
      md:flex-row 
      justify-between 
      items-start 
      md:items-end 
      gap-5 
      mb-8
      ">



        <div>


          <h1 className="
          text-3xl
          font-extrabold
          text-slate-900
          ">

            Materials Marketplace

          </h1>



          <p className="
          text-sm
          text-slate-500
          mt-2
          ">

            Explore available waste resources and connect with suppliers.

          </p>




          {/* VIEW BUTTONS */}


          <div className="
          flex
          gap-3
          mt-5
          ">



            <button

            onClick={()=>changeView("all")}

            className={`

            px-5

            py-2

            rounded-xl

            text-sm

            font-bold


            ${
              viewMode==="all"

              ?

              "bg-[#4A7538] text-white"

              :

              "bg-slate-100 text-slate-700"

            }

            `}

            >

              All Listings

            </button>





            <button

            onClick={()=>changeView("my")}

            className={`

            px-5

            py-2

            rounded-xl

            text-sm

            font-bold


            ${
              viewMode==="my"

              ?

              "bg-[#4A7538] text-white"

              :

              "bg-slate-100 text-slate-700"

            }

            `}

            >

              My Listings

            </button>



          </div>



        </div>





        {
          token && (


          <button

          onClick={()=>navigate("/add-listing")}

          className="
          bg-[#4A7538]
          text-white
          px-5
          py-3
          rounded-xl
          font-bold
          flex
          items-center
          gap-2
          "

          >


            <Plus className="h-5 w-5"/>


            Add Listing


          </button>


          )
        }




      </div>

      




      <div className="
      grid
      grid-cols-1
      lg:grid-cols-12
      gap-8
      ">





      {/* FILTER PANEL */}

      <div className="
      lg:col-span-3
      bg-white
      rounded-3xl
      border
      p-6
      space-y-6
      ">



        <div className="
        flex
        items-center
        gap-2
        font-bold
        text-slate-900
        ">


          <SlidersHorizontal className="h-4 w-4"/>

          Filters


        </div>





        {/* SEARCH */}


        <div>


          <label className="
          text-xs
          font-bold
          text-slate-500
          ">

            Search

          </label>



          <div className="
          relative
          mt-2
          ">


            <Search className="
            absolute
            left-3
            top-3
            h-4
            w-4
            text-slate-400
            "/>



            <input

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

            placeholder="Search listings..."

            className="
            w-full
            pl-10
            p-3
            rounded-xl
            border
            bg-slate-50
            text-sm
            "

            />


          </div>


        </div>







        {/* CATEGORY */}


        <div>


          <label className="
          text-xs
          font-bold
          text-slate-500
          ">

            Category

          </label>



          <select

          value={selectedCategory}

          onChange={(e)=>
            setSelectedCategory(e.target.value)
          }


          className="
          mt-2
          w-full
          p-3
          border
          rounded-xl
          text-sm
          "

          >


          {

            categories.map(cat=>(

              <option key={cat}>

                {cat}

              </option>


            ))

          }


          </select>


        </div>







        {/* LOCATION */}


        <div>


          <label className="
          text-xs
          font-bold
          text-slate-500
          ">

            Location

          </label>



          <input

          value={selectedLocation}

          onChange={(e)=>
            setSelectedLocation(e.target.value)
          }


          placeholder="City"


          className="
          mt-2
          w-full
          p-3
          rounded-xl
          border
          text-sm
          "


          />


        </div>







        {/* PRICE */}


        <div>


          <label className="
          text-xs
          font-bold
          text-slate-500
          ">

            Price

          </label>



          <div className="
          grid
          grid-cols-3
          gap-2
          mt-2
          ">


          {

            ["All","Free","Paid"].map(item=>(


              <button


              key={item}


              onClick={()=>
                setSelectedPrice(item)
              }



              className={`

              py-2

              rounded-lg

              text-xs

              font-bold


              ${
                selectedPrice===item

                ?

                "bg-[#4A7538] text-white"

                :

                "bg-slate-100"

              }

              `}



              >


                {item}


              </button>



            ))


          }



          </div>


        </div>







        {/* SORT */}


        <select


        value={sortBy}


        onChange={(e)=>
          setSortBy(e.target.value)
        }


        className="
        w-full
        p-3
        border
        rounded-xl
        text-sm
        "


        >


          <option value="newest">

            Newest

          </option>


          <option value="oldest">

            Oldest

          </option>


          <option value="price-asc">

            Price Low-High

          </option>


          <option value="price-desc">

            Price High-Low

          </option>


          <option value="quantity-desc">

            Quantity High-Low

          </option>


        </select>




      </div>









      {/* LISTING AREA */}


      <div className="
      lg:col-span-9
      ">




      {

        filteredListings.length===0 ?


        (

          <div className="
          bg-white
          rounded-3xl
          p-16
          text-center
          border
          ">


            <Inbox className="
            mx-auto
            h-10
            w-10
            text-slate-300
            "/>



            <h3 className="
            mt-4
            font-bold
            text-lg
            ">

              No Listings Found

            </h3>



            <p className="
            text-sm
            text-slate-500
            mt-2
            ">


              {

                viewMode==="my"

                ?

                "You have not created any listings."

                :

                "Try changing your filters."

              }


            </p>



          </div>


        )



        :



        (

        <div className="
        grid
        md:grid-cols-2
        gap-6
        ">


        {


        filteredListings.map(item=>(


          <motion.div


          key={item._id}


          initial={{
            opacity:0,
            y:10
          }}


          animate={{
            opacity:1,
            y:0
          }}



          className="
          bg-white
          rounded-3xl
          border
          overflow-hidden
          shadow-sm
          "



          >




            {/* IMAGE */}


            <img


            src={

              item.image ||

              "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b"

            }


            alt={item.name}



            className="
            w-full
            h-48
            object-cover
            "


            />







            <div className="p-6">





              <div className="
              flex
              justify-between
              items-start
              ">



                <h2 className="
                font-extrabold
                text-lg
                text-slate-900
                ">


                  {item.name}


                </h2>




                <span className="
                bg-emerald-50
                text-emerald-700
                px-3
                py-1
                rounded-full
                text-xs
                font-bold
                ">


                  {item.price}


                </span>



              </div>





              <p className="
              text-sm
              text-slate-500
              mt-3
              ">


                {item.description}


              </p>





              <div className="
              mt-4
              space-y-2
              text-sm
              text-slate-600
              ">




                <p className="flex gap-2">

                  <Layers className="h-4 w-4"/>

                  {item.category}

                </p>





                <p className="flex gap-2">

                  <Weight className="h-4 w-4"/>

                  {item.quantity} {item.unit}

                </p>





                <p className="flex gap-2">

                  <MapPin className="h-4 w-4"/>

                  {item.location}

                </p>



              </div>





              <div className="
              mt-4
              bg-slate-50
              rounded-xl
              p-3
              ">



                <p className="
                text-xs
                text-slate-500
                ">

                  Supplier

                </p>



                <p className="
                font-bold
                ">

                  {item.businessName}

                </p>


              </div>

        
               {/* ACTION BUTTONS */}

{viewMode === "all" && user?.accountType === "buyer" && (
  <button
    onClick={() => handleContact(item)}
    className="
      mt-5
      w-full
      bg-slate-950
      text-white
      py-3
      rounded-xl
      font-bold
      text-sm
      flex
      justify-center
      items-center
      gap-2
    "
  >
    <MessageSquare className="h-4 w-4" />
    Contact Supplier
  </button>
)}






              {

                viewMode==="my"

                &&


                <div className="
                flex
                gap-3
                mt-5
                ">



                  <button


                  onClick={()=>navigate(`/edit-listing/${item._id}`)}


                  className="
                  flex-1
                  bg-blue-50
                  text-blue-700
                  py-2
                  rounded-xl
                  font-bold
                  text-sm
                  flex
                  justify-center
                  items-center
                  gap-2
                  "


                  >


                    <Edit className="h-4 w-4"/>


                    Edit


                  </button>







                  <button


                  onClick={()=>handleDelete(item._id)}


                  className="
                  flex-1
                  bg-red-50
                  text-red-700
                  py-2
                  rounded-xl
                  font-bold
                  text-sm
                  flex
                  justify-center
                  items-center
                  gap-2
                  "


                  >


                    <Trash2 className="h-4 w-4"/>


                    Delete


                  </button>



                </div>


              }




            </div>


          </motion.div>


        ))}


        </div>


        )


      }


      </div>


      </div>

      {/* CONTACT MODAL */}


      <AnimatePresence>
      {

      contactModal.open && (
      <div className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/40
      backdrop-blur-sm
      p-4
      ">



        <motion.div


        initial={{
          opacity:0,
          scale:0.95
        }}


        animate={{
          opacity:1,
          scale:1
        }}


        exit={{
          opacity:0,
          scale:0.95
        }}



        className="
        bg-white
        rounded-3xl
        p-6
        w-full
        max-w-lg
        "



        >




          <div className="
          flex
          justify-between
          items-center
          mb-5
          ">


            <div>


              <h2 className="
              text-xl
              font-extrabold
              ">


                Contact Supplier


              </h2>



              <p className="
              text-xs
              text-slate-500
              mt-1
              ">


                {contactModal.listing?.name}


              </p>


            </div>





            <button


            onClick={()=>setContactModal({
              open:false,
              listing:null
            })}


            >


              <X/>


            </button>



          </div>







          <div className="
          bg-slate-50
          rounded-xl
          p-4
          mb-4
          ">


            <p className="
            font-bold
            text-slate-800
            ">


              {
                contactModal.listing?.businessName
                ||
                "Supplier"
              }


            </p>



            <p className="
            text-xs
            text-slate-500
            mt-2
            ">


              {
                contactModal.listing?.phone
              }


              {" | "}


              {
                contactModal.listing?.email
              }


            </p>



          </div>







          <form
          onSubmit={submitMessage}
          className="space-y-4"
          >



            <textarea


            value={messageText}


            onChange={(e)=>
              setMessageText(e.target.value)
            }


            rows="5"


            placeholder="Write your proposal..."


            className="
            w-full
            border
            rounded-xl
            p-4
            text-sm
            outline-none
            "


            required


            />






            <div className="
            flex
            justify-end
            gap-3
            ">



              <button


              type="button"


              onClick={()=>setContactModal({
                open:false,
                listing:null
              })}


              className="
              px-5
              py-2
              rounded-xl
              bg-slate-100
              font-bold
              "


              >


                Cancel


              </button>






              <button


              type="submit"


              className="
              px-5
              py-2
              rounded-xl
              bg-[#4A7538]
              text-white
              font-bold
              ">
                Send Request


              </button>



            </div>




          </form>




        </motion.div>




      </div>


      )


      }



      </AnimatePresence>





    </div>


  );


};



export default Listings;