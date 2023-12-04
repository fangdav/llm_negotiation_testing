const pointsToMarkdown = (points) => points.map(({ name, options }, idx) => {
  return `${idx + 1}. ${name}

|Option|Agreement|Points|
|------|-----|------|
${options
.map(({ name, agreement, points }) => {
  return `|${name}|${agreement}|${points}|`;
})
.join("\n")}
`;
})
.join("\n");

const cooPoints = [
  {
    name: "Lump Sum Fee",
    options: [
      { name: "A", agreement: "$25,000", points: 1500 },
      { name: "B", agreement: "$30,000", points: 1200 },
      { name: "C", agreement: "$35,000", points: 900 },
      { name: "D", agreement: "$40,000", points: 600 },
      { name: "E", agreement: "$45,000", points: 300 },
    ],
  },
  {
    name: "Stock Options",
    options: [
      { name: "A", agreement: "0 shares", points: 250 },
      { name: "B", agreement: "1,000 shares", points: 200 },
      { name: "C", agreement: "5,000 shares", points: 150 },
      { name: "D", agreement: "10,000 shares", points: 100 },
      { name: "E", agreement: "15,000 shares", points: 50 },
    ],
  },
  {
    name: "Discretioanry Budget",
    options: [
      { name: "A", agreement: "No discretionary budget", points: 1000 },
      { name: "B", agreement: "$5,000 discretionary budget", points: 800 },
      { name: "C", agreement: "$10,000 discretionary budget", points: 600 },
      { name: "D", agreement: "$15,000 discretionary budget", points: 400 },
      { name: "E", agreement: "$20,000 discretionary budget", points: 200 },
    ],
  },
];

const coo = `

As COO of a growing startup, you're preparing to negotiate with a consultant on three key issues, as directed by your CEO. 
This meeting is crucial but not an interview, as the consultant's hire depends on resolving these issues. 
You've created a Points Schedule to guide your negotiation strategy.

${pointsToMarkdown(cooPoints)}

Your objective is to maximize points by reaching an agreement on three issues with the consultant. 
If no agreement is reached, you will be given a score of 500 points.
Maintain confidentiality of your points and instructions.
This information is solely for you as you prepare for the meeting.

`;

const consultantPoints = [
  {
    name: "Lump Sum Fee",
    options: [
      { name: "A", agreement: "$25,000", points: 200 },
      { name: "B", agreement: "$30,000", points: 400 },
      { name: "C", agreement: "$35,000", points: 600 },
      { name: "D", agreement: "$40,000", points: 800 },
      { name: "E", agreement: "$45,000", points: 1000 },
    ],
  },
  {
    name: "Stock Options",
    options: [
      { name: "A", agreement: "0 shares", points: 100 },
      { name: "B", agreement: "1,000 shares", points: 200 },
      { name: "C", agreement: "5,000 shares", points: 300 },
      { name: "D", agreement: "10,000 shares", points: 400 },
      { name: "E", agreement: "15,000 shares", points: 500 },
    ],
  },
  {
    name: "Discretionary Budget",
    options: [
      { name: "A", agreement: "No discretionary budget", points: 300 },
      { name: "B", agreement: "$5,000 discretionary budget", points: 600 },
      { name: "C", agreement: "$10,000 discretionary budget", points: 900 },
      { name: "D", agreement: "$15,000 discretionary budget", points: 1200 },
      { name: "E", agreement: "$20,000 discretionary budget", points: 1500 },
    ],
  },
];

const consultant = `
As a freelance consultant with a startup background and an Executive MBA, you're set to negotiate with a startup's COO about a summer consulting role. 
Three key issues need resolution. 
You've prepared a Points Schedule to outline your preferences in these negotiations.

${pointsToMarkdown(consultantPoints)}

Your objective is to maximize points by reaching an agreement on three issues with the COO. 

If no agreement is reached, you will be given a score of 500 points. 
Maintain confidentiality of your points and instructions. 
This information is solely for you as you prepare for the meeting.

`;

const instructions = {
  coo,
  consultant,
};

const points = {
  coo: cooPoints,
  consultant: consultantPoints,
};

export { instructions, points };
