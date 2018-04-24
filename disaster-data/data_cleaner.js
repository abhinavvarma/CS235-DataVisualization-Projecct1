/**
 * Created by Abhinav
 // */

var bubble_chart_data = require("./../static/js/bubble_chart_data");
var countries = require("./../static/js/countries");
var fs = require("fs");

function mergeDisasters(bubble_chart_data) {
    for (var countryCode in bubble_chart_data) {
        if (bubble_chart_data.hasOwnProperty(countryCode)) {
            var yearsObject = bubble_chart_data[countryCode];
            for (var year in yearsObject) {
                if (yearsObject.hasOwnProperty(year)) {
                    var disastersObject = {};
                    var disasterList = yearsObject[year];
                    disasterList.forEach(function (disasterData) {
                        var disasterType = disasterData["Disaster_type"];
                        if (disastersObject[disasterType]) {
                            disastersObject[disasterType].Insured_losses += disasterData.Insured_losses;
                            disastersObject[disasterType].Total_deaths += disasterData.Total_deaths;
                            disastersObject[disasterType].Total_damage += disasterData.Total_damage;
                        } else {
                            disastersObject[disasterType] = disasterData;
                        }
                    });
                    yearsObject[year] = Object.values(disastersObject);
                }
            }
        }
    }
}

function mergeCountries(countries) {
    var countriesObj = {};

    for (var country in countries) {
        if (countries.hasOwnProperty(country)) {
            countriesObj[countries[country].code] = countries[country].name;
        }
    }
    fs.writeFile('./countries.json', JSON.stringify(countriesObj) , 'utf-8');
    return countriesObj;
}

// fs.writeFile('./data.json', JSON.stringify(bubble_chart_data) , 'utf-8');
mergeCountries(countries);