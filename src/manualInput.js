import * as THREE from "three";
import * as d3 from "d3";
// import csvData from "./test2.csv";
// import emptyLands from "./emptyLandsOnly.csv";
// import allLands from "./allLands.csv";
import { allLands } from "./allLandsData";

// const fetchText = async (url) => {
//   const response = await fetch(url);
//   return await response.text();
// };

// fetchText(allLands).then((text) => {
const data = d3.csvParse(allLands);
// });

const manualInput = (gridGeo) => {
  const posArray = gridGeo.attributes.position.array;
  const emptyLandColor = [0.55, 0.2, 0.7];

  const SR4LandColor = [0.3 * 0.9, 0.2 * 0.9, 0.5 * 0.9];
  const SR3LandColor = [0.6 * 0.6, 0.5 * 0.6, 1.0 * 0.6];
  const SR2LandColor = [0.6 * 0.75, 0.5 * 0.75, 1.0 * 0.75];
  const SR1LandColor = [0.6, 0.5, 1.0];

  const SRa4LandColor = [0.96, 0.0, 0.898];
  const SRa3LandColor = [0.749, 0.455, 0.533];
  const SRa2LandColor = [0.718, 0.509, 0.569];
  const SRa1LandColor = [0.894, 0.666, 0.812];

  const R4LandColor = [0.98, 0.952, 0.145];
  const R3LandColor = [0.87, 0.757, 0.32];
  const R2LandColor = [0.663, 0.604, 0.32];
  const R1LandColor = [0.83, 0.812, 0.651];

  const C4LandColor = [0.145, 0.87, 0.98];
  const C3LandColor = [0.34, 0.553, 0.83];
  const C2LandColor = [0.529, 0.651, 0.894];
  const C1LandColor = [0.718, 0.89, 1.0];

  const colorsSet = {
    5: {
      10: emptyLandColor,
      20: emptyLandColor,
      30: emptyLandColor,
    },
    4: {
      4: SR4LandColor,
      3: SR3LandColor,
      2: SR2LandColor,
      1: SR1LandColor,
    },
    3: {
      4: SRa4LandColor,
      3: SRa3LandColor,
      2: SRa2LandColor,
      1: SRa1LandColor,
    },
    2: {
      4: R4LandColor,
      3: R3LandColor,
      2: R2LandColor,
      1: R1LandColor,
    },
    1: {
      4: C4LandColor,
      3: C3LandColor,
      2: C2LandColor,
      1: C1LandColor,
    },
  };

  const raritiesSet = {
    // 5: "nz",
    5: "noborderz",
    // 4: "sr2",
    4: "super rare 2",
    // 3: "sr",
    3: "super rare",
    2: "rare",
    1: "common",
  };

  const colors = [];
  const landCoords = [];
  const landSizes = [];
  const aSizes = [];
  const aRarities = [];
  let jsonString = "";
  let landID = 1;
  let locationsIndex = {};

  let NBZ = [0, 0, 0]; //10x10,20x20,30x30 --Noborderz
  let SR2 = [0, 0, 0, 0]; //1x1,2x2,3x3,4x4 --Super Rare 2
  let SR1 = [0, 0, 0, 0]; //1x1,2x2,3x3,4x4 --Super rare 1
  let R = [0, 0, 0, 0]; //1x1,2x2,3x3,4x4 --Rare
  let C = [0, 0, 0, 0]; //1x1,2x2,3x3,4x4 --Common

  jsonString += "["; // <---------------- START JSON
  let loadedData;
  //d3.csv(emptyLands).then((data) => {/************ */
  loadedData = data;
  for (let x = 0; x < loadedData["columns"].length; x++) {
    for (let y = 0; y < loadedData.length; y++) {
      const code = loadedData[y][x];
      if (code !== "") {
        const rarityAndSize = code.split("R")[1].split("S");
        const realCoords = [x - 196.01, 195.01 - y]; //avoid division by 0 error
        landCoords.push(...realCoords);
        landSizes.push(rarityAndSize[1], rarityAndSize[1]);
        aRarities.push(rarityAndSize[0]);
        colors.push(...colorsSet[rarityAndSize[0]][rarityAndSize[1]]);
        jsonString += "{";
        jsonString += "'id': " + landID + ", ";
        landID++;
        jsonString +=
          "'coords': [" +
          Math.round(realCoords[0]) +
          "," +
          Math.round(realCoords[1]) +
          "], ";

        jsonString +=
          "'size': [" + rarityAndSize[1] + "," + rarityAndSize[1] + "], ";
        jsonString += "'rarity': '" + raritiesSet[rarityAndSize[0]] + "', ";
        jsonString += "}, ";

        //get breakdown
        switch (rarityAndSize[0]) {
          case "1":
            C[parseInt(rarityAndSize[1]) - 1] += 1;
            break;
          case "2":
            R[parseInt(rarityAndSize[1]) - 1] += 1;
            break;
          case "3":
            SR1[parseInt(rarityAndSize[1]) - 1] += 1;
            break;
          case "4":
            SR2[parseInt(rarityAndSize[1]) - 1] += 1;
            break;
          case "5":
            NBZ[parseInt(rarityAndSize[1] / 10) - 1] += 1;
            break;

          default:
            break;
        }
      }
    }
  }
  jsonString += "]"; // <------------------END JSON

  for (let i = 0; i < posArray.length / 3; i++) {
    //move all to z = 200
    posArray[i * 3 + 1] -= 4001.0; //hide all excess lands

    //   //position with land coords
    if (landCoords[i * 2] && landCoords[i * 2 + 1]) {
      posArray[i * 3] = landCoords[i * 2];
      posArray[i * 3 + 1] = landCoords[i * 2 + 1];

      if (landSizes[i * 2] && landSizes[i * 2 + 1]) {
        aSizes[i * 2] = landSizes[i * 2];
        aSizes[i * 2 + 1] = landSizes[i * 2 + 1];

        //locations index for each square unit
        for (let width = 0; width < landSizes[i * 2]; width++) {
          for (let height = 0; height < landSizes[i * 2 + 1]; height++) {
            const xProp = String(width + Math.round(landCoords[i * 2])),
              yProp = String(height + Math.round(landCoords[i * 2 + 1]));
            if (!locationsIndex[xProp]) locationsIndex[xProp] = {};
            locationsIndex[xProp][yProp] = i;
          }
        }
      }
    } else {
      aSizes[i * 2] = 1.0;
      aSizes[i * 2 + 1] = 1.0;
    }

    //   //add color attributes to verts

    colors.push(1.0);
    colors.push(0.0);
    colors.push(0.0);
  }

  //add a general filter for visibilities
  const visibilities = new Array(aSizes.length / 2).fill(1);
  gridGeo.setAttribute(
    "aColor",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
  gridGeo.setAttribute(
    "aSizes",
    new THREE.BufferAttribute(new Float32Array(aSizes), 2)
  );
  gridGeo.setAttribute(
    "aRarities",
    new THREE.BufferAttribute(new Float32Array(aRarities), 1)
  );
  gridGeo.setAttribute(
    "aVisibilities",
    new THREE.BufferAttribute(new Float32Array(visibilities), 1)
  );

  gridGeo.attributes.position.needsUpdate = true;
  gridGeo.attributes.aSizes.needsUpdate = true;
  gridGeo.attributes.aColor.needsUpdate = true;
  gridGeo.attributes.aRarities.needsUpdate = true;
  gridGeo.attributes.aVisibilities.needsUpdate = true;
  //}); //extend into promise, /**************** */

  const facePlane = new THREE.BufferGeometry();
  const thickness = 0.05;
  const facePosArray = [];
  const faceColArray = [];
  const faceSizesArray = [];
  const faceRaritiesArray = [];
  const faceVisibilitiesArray = [];
  const faceSelfIndicesArray = [];

  for (let i = 0; i < 75198 /*posArray.length / 3*/; i++) {
    /************* MAKE LAND PIECES ****** */
    const thisLandSize = gridGeo.attributes.aSizes.array[i * 2];
    //Left Triangle in Quad
    facePosArray.push(posArray[i * 3] + thickness); //bottom left X
    facePosArray.push(posArray[i * 3 + 1] + thickness); //bottom left Y
    facePosArray.push(posArray[i * 3 + 2]); //bottom left Z
    facePosArray.push(posArray[i * 3] + thisLandSize - thickness); //Top right X
    facePosArray.push(posArray[i * 3 + 1] + thisLandSize - thickness); //Top right Y
    facePosArray.push(posArray[i * 3 + 2]); //Top right Z
    facePosArray.push(posArray[i * 3] + thickness); //Top left X
    facePosArray.push(posArray[i * 3 + 1] + thisLandSize - thickness); //Top left Y
    facePosArray.push(posArray[i * 3 + 2]); //Top left Z

    //Right Triangle in Quad
    facePosArray.push(posArray[i * 3] + thickness); //bottom left X
    facePosArray.push(posArray[i * 3 + 1] + thickness); //bottom left Y
    facePosArray.push(posArray[i * 3 + 2]); //bottom left Z
    facePosArray.push(posArray[i * 3] + thisLandSize - thickness); //Bottom Right X
    facePosArray.push(posArray[i * 3 + 1] + thickness); //Bottom Right Y
    facePosArray.push(posArray[i * 3 + 2]); //Bottom Right Z
    facePosArray.push(posArray[i * 3] + thisLandSize - thickness); //Top right X
    facePosArray.push(posArray[i * 3 + 1] + thisLandSize - thickness); //Top right Y
    facePosArray.push(posArray[i * 3 + 2]); //Top right Z

    for (
      let j = 0;
      j < 6; //repeat 6 times
      j++
    ) {
      /*************** SET INITIAL LAND COLORS ****************/
      faceColArray.push(colors[i * 3]);
      faceColArray.push(colors[i * 3 + 1]);
      faceColArray.push(colors[i * 3 + 2]);

      /***************STORE LAND SIZES******************** */
      faceSizesArray.push(thisLandSize);

      /***************STORE LAND RARTIES ******************** */
      faceRaritiesArray.push(aRarities[i]);

      /***************STORE LAND Visibilities ******************** */
      faceVisibilitiesArray.push(visibilities[i]);

      /***************STORE LAND Array index for easier search ******************** */
      faceSelfIndicesArray.push(i);
    } //and of 6 set values
  }
  facePlane.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(facePosArray), 3)
  );
  facePlane.setAttribute(
    "aColor",
    new THREE.BufferAttribute(new Float32Array(faceColArray), 3)
  );
  facePlane.setAttribute(
    "aSizes",
    new THREE.BufferAttribute(new Float32Array(faceSizesArray), 1)
  );
  facePlane.setAttribute(
    "aRarities",
    new THREE.BufferAttribute(new Float32Array(faceRaritiesArray), 1)
  );
  facePlane.setAttribute(
    "aVisibilities",
    new THREE.BufferAttribute(new Float32Array(faceVisibilitiesArray), 1)
  );
  facePlane.setAttribute(
    "aThisLandIndex",
    new THREE.BufferAttribute(new Float32Array(faceSelfIndicesArray), 1)
  );
  return [facePlane, locationsIndex];
};

export default manualInput;
