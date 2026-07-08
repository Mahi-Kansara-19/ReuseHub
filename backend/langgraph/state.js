const { Annotation } = require("@langchain/langgraph");

const StateAnnotation = Annotation.Root({
  listingId: Annotation(),
  listing: Annotation(),
  validation: Annotation(),
  analysis: Annotation(),
  matches: Annotation(),
  rankings: Annotation(),
  price: Annotation(),
  sustainability: Annotation(),
  recommendation: Annotation(),
});

module.exports = {
  StateAnnotation,
};
