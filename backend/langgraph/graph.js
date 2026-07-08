const { StateGraph, START, END } = require("@langchain/langgraph");
const { StateAnnotation } = require("./state");

const ListingValidator = require("./nodes/ListingValidator");
const WasteAnalysis = require("./nodes/WasteAnalysis");
const BuyerMatcher = require("./nodes/BuyerMatcher");
const BuyerRanking = require("./nodes/BuyerRanking");
const PriceRecommendation = require("./nodes/PriceRecommendation");
const SustainabilityAgent = require("./nodes/SustainabilityAgent");
const RecommendationAgent = require("./nodes/RecommendationAgent");

// Compile state graph
const workflow = new StateGraph(StateAnnotation)
  .addNode("validate", ListingValidator)
  .addNode("analyze", WasteAnalysis)
  .addNode("match", BuyerMatcher)
  .addNode("rank", BuyerRanking)
  .addNode("price_agent", PriceRecommendation)
  .addNode("sustainability_agent", SustainabilityAgent)
  .addNode("recommend", RecommendationAgent);

workflow.addEdge(START, "validate");

// Conditional routing after validation
const routeAfterValidation = (state) => {
  if (state.validation && state.validation.status === "invalid") {
    return "recommend";
  }
  return "analyze";
};

workflow.addConditionalEdges("validate", routeAfterValidation);

workflow.addEdge("analyze", "match");
workflow.addEdge("match", "rank");
workflow.addEdge("rank", "price_agent");
workflow.addEdge("price_agent", "sustainability_agent");
workflow.addEdge("sustainability_agent", "recommend");
workflow.addEdge("recommend", END);

const app = workflow.compile();

module.exports = app;
