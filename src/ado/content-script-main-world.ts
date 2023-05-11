declare var dataProviders: any;
let generateButton;
let generateCompletedButton;

type Iteration = {
  id: string
  friendlyPath: string
}

const getSelectedIteration: () => Iteration = () => {
  return dataProviders.data["ms.vss-work-web.sprints-hub-content-header-data-provider"].selectedIteration
}

async function createSummary() {
  const iteration = getSelectedIteration();
  console.log(`Creating summary for ${iteration.id}...`);
  document.dispatchEvent(new CustomEvent('getSummaryForIteration',
    {
      detail: iteration
    }));
}

async function createCompletedSummary() {
  const iteration = getSelectedIteration();
  console.log(`Creating completed summary for ${iteration.id}...`);
  document.dispatchEvent(new CustomEvent('getCompletedSummaryForIteration',
    {
      detail: iteration
    }));
}

async function addGenerateButton() {
  //////// Generate button
  generateButton = document.createElement("button");
  generateButton.textContent = "Generate summary";

  // copy styling from ADO button
  generateButton.id = "generate-summary-button"
  generateButton.className = "vss-PivotBar--button bolt-button enabled bolt-focus-treatment";
  generateButton.onclick = createSummary;

  //////// Generate completed summary button 
  generateCompletedButton = document.createElement("button");
  generateCompletedButton.textContent = "Generate completed summary";

  // copy styling from ADO button
  generateCompletedButton.id = "generate-completed-summary-button"
  generateCompletedButton.className = "vss-PivotBar--button bolt-button enabled bolt-focus-treatment";
  generateCompletedButton.onclick = createCompletedSummary;

  //TODO: check that we're on an iteration view first
  let topBar = document.getElementsByClassName("vss-HubTileRegion")[0];
  if (topBar) {
    topBar.prepend(generateButton);
    topBar.prepend(generateCompletedButton);
  } else {
    waitFirst();
  }
}

function waitFirst() {
  window.setTimeout(addGenerateButton, 100);
}

waitFirst();

export { }