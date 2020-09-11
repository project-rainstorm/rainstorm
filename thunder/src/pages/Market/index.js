import React from "react";
import FlexTable from "../../components/FlexTable";
import Modal from "../../components/Modal";

const data = [
  {
    bounty: "50k",
    wanted: "geometric vase",
    location: "US",
    color: "White",
    density: "50%",
    fillament: "PETG"
  },
  {
    bounty: "20k",
    wanted: "xbox controller mod",
    location: "US",
    color: "Any",
    density: "20%",
    fillament: "PLA"
  },
  {
    bounty: "102k",
    wanted: "dash pannel",
    location: "EU",
    color: "Black",
    density: "50%",
    fillament: "PLA"
  },
  {
    bounty: "200k",
    wanted: "figure",
    location: "US",
    color: "White",
    density: "20%",
    fillament: "PETG"
  },
  {
    bounty: "1.2M",
    wanted: "200 face shields ",
    location: "US",
    color: "Any",
    density: "50%",
    fillament: "PLA"
  }
];

export default class Market extends React.Component {
  state = {
    jobs: [{ p: "" }]
  };

  sayIt = () => {
    console.log("IT");
  };

  render() {
    const columns = [
      {
        name: "bounty",
        label: "BOUNTY"
      },
      {
        name: "wanted",
        label: "WANTED"
      },
      {
        name: "location",
        label: "TO"
      },
      {
        name: "color",
        label: "COLOR"
      },
      {
        name: "density",
        label: "DENSITY"
      },
      {
        name: "fillament",
        label: "MATERIAL"
      }
    ];

    return <FlexTable columns={columns} data={data} />;
  }
}
