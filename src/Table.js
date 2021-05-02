import React from 'react';
import './Table.css';
import numeral from 'numeral';

function Table({countries}) {
  // console.log(countries)
  return (
    <div className="table">
      <table>
        <tbody>
            {countries.map((country) => (
              <tr className="tr" key={country.country}>
                <td>{country.country}</td>
                {/* 10,000,000     , !*/}
                <td><strong>{numeral(country.cases).format("0,0")}</strong></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table;
