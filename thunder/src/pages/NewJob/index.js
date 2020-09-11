import React from "react";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";

export default class NewJob extends React.Component {
  state = {
    title: "",
    material: "",
    color: "",
    density: "",
    bounty: "",
    notes: "",
    country: "",
    file: ""
  };

  render() {
    return (
      <form>
        <InputField
          label="title"
          value={this.state.title}
          onChange={e => this.setState({ title: e })}
        />
        <SelectField
          label="material"
          value={this.state.material}
          onChange={e => this.setState({ material: e })}
          options={materials}
        />
        <SelectField
          label="color"
          value={this.state.color}
          onChange={e => this.setState({ color: e })}
          options={colors}
        />
        <SelectField
          label="density"
          value={this.state.density}
          onChange={e => this.setState({ density: e })}
          options={infils}
        />
        <SelectField
          label="country"
          value={this.state.country}
          onChange={e => this.setState({ country: e })}
          options={countries}
        />
        <InputField
          label="bounty"
          value={this.state.bounty}
          onChange={e => this.setState({ bounty: e })}
        />
      </form>
    );
  }
}

// Select Options

const infils = [...Array(21).keys()].map(x => `${x * 5}%`);

const materials = ["Any", "ABS", "PLA", "PETG"];

const colors = [
  "Any",
  "White",
  "Silver",
  "Grey",
  "Black",
  "Navy",
  "Blue",
  "Cerulean",
  "Sky Blue",
  "Turquoise",
  "Blue-Green",
  "Azure",
  "Teal",
  "Cyan",
  "Green",
  "Lime",
  "Chartreuse",
  "Olive",
  "Yellow",
  "Gold",
  "Amber",
  "Orange",
  "Brown",
  "Orange-Red",
  "Red",
  "Maroon",
  "Rose",
  "Red-Violet",
  "Pink",
  "Magenta",
  "Purple",
  "Blue-Violet",
  "Indigo",
  "Beige",
  "Ivory",
  "Violet",
  "Peach",
  "Apricot",
  "Ochre",
  "Plum"
];

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua & Deps",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Rep",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Congo {Democratic Rep}",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland {Republic}",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea North",
  "Korea South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar, {Burma}",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russian Federation",
  "Rwanda",
  "St Kitts & Nevis",
  "St Lucia",
  "Saint Vincent & the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome & Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad & Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];
