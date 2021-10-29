import React, { useState } from 'react';
import './App.css';

//NOTE: All other documentation can be found in README.md


//Definitions
/* 
    Asset Name - Name of an asset
    Project Name - Name of the Project/Collection that an asset belongs to
    Volume - Total earnings from an asset
    24hr % - Change in price (as a percent) of an asset over last 24 hours
    7d % - Change in price (as a percent) of an asset over last 7 days
    Floor Price - The lowest price that an asset has ever been sold for
*/



function App() {

  //States-----------------------------------------------------||

  //API Data
  const [rawAssetData, setRawAssetData] = useState(null);

  //Search
  const[searchValue, setSearchValue] = useState("spacebudz");

  //Filter
  const[filterValue, setFilterValue] = useState(0);




  //Functions-----------------------------------------------------||

  //Get Data from API

  function getData(searchTerm) {
    fetch('https://api.cnft.io/market/listings', {
    method: 'POST',
    body: JSON.stringify({
      sort:"price",
      order:"desc",
      page:1,
      verified:true,
      search: searchTerm,
      sold:true
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    })
    .then((response) => response.json())
    .then((json) => setRawAssetData(json["assets"]))
  }


  //Calculate Floor Price

  function calculateFloorPrice(id){
    var floorPrice = 999999999999999;
    rawAssetData.forEach(element => {
      if (element['metadata']['thumbnail'] === id && element['price'] < floorPrice) {
        return floorPrice = element['price']
      }
    });
    return floorPrice;
  }



  //Calculate Volume

  function calculateVolume(id){
    var soldVolume = 0;
    rawAssetData.forEach(element => {
      if (element['metadata']['thumbnail'] === id) {
        return soldVolume += element['price']
      }
    });
    return soldVolume;
  }



  //Calculate 7d%

  function sevenDayPercent(id){
    var firstValue;
    var lastValue;
    rawAssetData.forEach((element, index) => {
      if (element['metadata']['thumbnail'] === id && new Date(element['dateSold']) >= (Date.now() - 7 * 24 * 60 * 60 * 1000).toString() ) {
        if(index=0){
          return firstValue = element['price'];
        } else{
          return lastValue = element['price'];
        }
      }
    });
    return isNaN(((lastValue - firstValue)/lastValue)*100) ? "0%" : ((lastValue - firstValue)/lastValue)*100;
  }



  //Calculate 24hr%

  function twentyFourHourPercent(id){
    var firstValue;
    var lastValue;
    rawAssetData.forEach((element, index) => {
      if (element['metadata']['thumbnail'] === id && new Date(element['dateSold']) >= (Date.now() - 1 * 24 * 60 * 60 * 1000).toString() ) {
        if(index=0){
          return firstValue = element['price'];
        } else{
          return lastValue = element['price'];
        }
      }
    });
    return isNaN(((lastValue - firstValue)/lastValue)*100) ? "0%" : ((lastValue - firstValue)/lastValue)*100;
  }



  //Search and Filter changes

  const searchValueChanged = e => {
    setSearchValue(e.target.value);
    getData(e.target.value)
    
  };

  const filterValueChanged = e => {
    setFilterValue(e.target.value);

  };


  //Page Render-----------------------------------------------------||

  return (
    <div className="App" style={{height: "100vh"}}>
      <div className="wrapper" style={{display: "flex", flexDirection: 'column', flex: 1, justifyContent: 'stretch', alignSelf: 'stretch'}}>
        <div className="search" style={{flexDirection: 'row', margin: 30, flex: 1, justifySelf: 'stretch', backgroundColor: 'red', display: 'flex'}}>
            <input
              style={{height: 50, flex: 0.8, justifySelf: 'stretch', fontSize: 25, fontWeight: 600}} 
              type = "search" 
              placeholder = "Search Assets" 
              onChange = {searchValueChanged}
              value = {searchValue}
            />
            <select style={{height: 50, flex: 0.2, justifySelf: 'stretch',fontSize: 25, fontWeight: 600}}
            onChange = {filterValueChanged}>
              <option value = "0">All Time</option>
              <option value = {(Date.now() - 1 * 24 * 60 * 60 * 1000).toString()}>Last 24hr</option>
              <option value = {(Date.now() - 7 * 24 * 60 * 60 * 1000).toString()}>7 Days</option>
              <option value = {(Date.now() - 30 * 24 * 60 * 60 * 1000).toString()}>1 Month</option>
            </select>
        </div>
      
      <table style={{flex: 1, padding: 70}}>
        <thead>
          <tr>
            <th style={{fontSize: 30}}>Asset Name</th>
            <th style={{fontSize: 30}}>Project Name</th>
            <th style={{fontSize: 30}}>Volume</th>
            <th style={{fontSize: 30}}>24hr %</th>
            <th style={{fontSize: 30}}>7d %</th>
            <th style={{fontSize: 30}}>Floor Price</th>
          </tr>
        </thead>
        <tbody id="tableRows">
        {rawAssetData != null ? rawAssetData.map((item) => (
          new Date(item['dateSold']) >= filterValue ? 
            
              <tr key={item.id}>
                <td style={{fontSize: 20, padding: 10}}>{item['metadata']['name']}</td>
                <td style={{fontSize: 20, padding: 10}}>{item['verified']['project']}</td>
                <td style={{fontSize: 20, padding: 10}}>{calculateVolume(item['metadata']['thumbnail'])}</td>
                <td style={{fontSize: 20, padding: 10}}>{twentyFourHourPercent(item['metadata']['thumbnail'])}</td>
                <td style={{fontSize: 20, padding: 10}}>{sevenDayPercent(item['metadata']['thumbnail'])}</td>
                <td style={{fontSize: 20, padding: 10}}>{calculateFloorPrice(item['metadata']['thumbnail'])}</td>
                
              </tr>
        
            : null)): null}
        
        </tbody>
      </table>

      </div>
      
    </div>
  );
}

export default App;
