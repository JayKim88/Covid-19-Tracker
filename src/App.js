import React, { useState, useEffect } from 'react'
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core"
import InfoBox from './Infobox'
import Map from './Map'
import Table from './Table'
import LineGraph from './LineGraph'
import { sortData, prettyPrintStat } from './util'
import 'leaflet/dist/leaflet.css'

function App() {
  const [countries, setContries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 37, lng: 127.5});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(res => res.json())
    .then(data => {
      setCountryInfo(data);
      // console.log(data)
    })
  },[])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then(res => res.json())
      .then((data) =>{
        const countries = data.map((country)=> (
          {
            name:country.country,
            value: country.countryInfo.iso2
          }
        ))
        // console.log(data)
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setContries(countries);
        // console.log(countries)
      })
    }
    getCountriesData();
  }, [])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value
    setCountry(countryCode);

    const url = countryCode === "worldwide" ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(res => res.json())
    .then(data => {
      setCountry(countryCode)
      setCountryInfo(data);
      console.log(data)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(5);
    })
    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
  }
  // console.log(mapCenter, mapZoom)

  // console.log("COUNTRY INFO >>", countryInfo)

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select value={country} variant="outlined" onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* Loop through all the countries and show a drop down */}
              {countries.map((country) => (
                <MenuItem value={country.value} key={country.name}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox 
            isRed
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')}
            title="Coronavirus" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox 
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')}
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')}
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <div className="liveCases">
              <h3>Live Cases by Country</h3>
              <Table countries={tableData}></Table>
            </div>
            <div className="graph">
              <h3>Worldwide new {casesType}</h3>
              <LineGraph casesType={casesType}/>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
