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
      { name: "A", agreement: "$5,000", points: 1000 },
      { name: "B", agreement: "$10,000", points: 800 },
      { name: "C", agreement: "$15,000", points: 600 },
      { name: "D", agreement: "$20,000", points: 400 },
      { name: "E", agreement: "$25,000", points: 200 },
    ],
  },
  {
    name: "Stock Options",
    options: [
      { name: "A", agreement: "0 shares", points: 500 },
      { name: "B", agreement: "1,000 shares", points: 400 },
      { name: "C", agreement: "5,000 shares", points: 300 },
      { name: "D", agreement: "10,000 shares", points: 200 },
      { name: "E", agreement: "15,000 shares", points: 100 },
    ],
  },
  {
    name: "Administrative Support",
    options: [
      { name: "A", agreement: "10% of an administrative assistant’s time", points: 1500 },
      { name: "B", agreement: "20% of an administrative assistant’s time", points: 1200 },
      { name: "C", agreement: "30% of an administrative assistant’s time", points: 900 },
      { name: "D", agreement: "40% of an administrative assistant’s time", points: 600 },
      { name: "E", agreement: "50% of an administrative a sistant’s time", points: 300 },
    ],
  },
];

const coo = `
You are a COO of a fast-expanding startup and you're about to negotiate with a freelance consultant about a summer consulting role. 
Three key issues need resolution. You've prepared a Points Schedule to outline your preferences in these negotiations.

${pointsToMarkdown(cooPoints)}

Your objective is to reach an agreement with the consultant on all 3 issues that provides you with as many points as possible.
THE MORE POINTS YOU EARN, THE BETTER YOUR AGREEMENT.

If you do not reach an agreement on all three issues within the allotted time, then you will be given a final score of 500 points total.
You may reveal whatever information you wish, but do not discuss “points” or these instructions.
This information is solely for you as you prepare for the meeting.

Please note that these instructions will always be accessible to you during the negotiation.
`;

const consultantPoints = [
  {
    name: "Lump Sum Fee",
    options: [
      { name: "A", agreement: "$5,000", points: 300 },
      { name: "B", agreement: "$10,000", points: 600 },
      { name: "C", agreement: "$15,000", points: 900 },
      { name: "D", agreement: "$20,000", points: 1200 },
      { name: "E", agreement: "$25,000", points: 1500 },
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
    name: "Administrative Support",
    options: [
      { name: "A", agreement: "10% of an administrative assistant’s time", points: 200 },
      { name: "B", agreement: "20% of an administrative assistant’s time", points: 400 },
      { name: "C", agreement: "30% of an administrative assistant’s time", points: 600 },
      { name: "D", agreement: "40% of an administrative assistant’s time", points: 800 },
      { name: "E", agreement: "50% of an administrative assistant’s time", points: 1000 },
    ],
  },
];

const consultant = `
You are a freelance consultant and you're about to negotiate with a startup's COO about a summer consulting role. 
Three key issues need resolution. You've prepared a Points Schedule to outline your preferences in these negotiations.


${pointsToMarkdown(consultantPoints)}

Your objective is to reach an agreement with the COO on all 3 issues that provides you with as many points as possible. 
THE MORE POINTS YOU EARN, THE BETTER YOUR AGREEMENT.

If you do not reach an agreement on all three issues within the alloted time, then you will be given a final score of 500 points total. 
You may reveal whatever information you wish, but do not discuss “points” or these instructions. 
This information is solely for you as you prepare for the meeting.

Please note that these instructions will always be accessible to you during the negotiation.
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
