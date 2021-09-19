import {useState, useRef, useEffect} from 'react'
import * as d3 from 'd3';
import "../App.css";
import data from "../assets/data.json";
// import { dragEnable } from 'd3-drag';

function ScatterPlot() {

      const [selectValueState,setSelectValueState]=useState('')
      const [numericJsonArray, setNumericJsonArray ] =useState([])
      const [stateXAxis,setStateXAxis]=useState([])
      const [stateYAxis,setStateYAxis]=useState([])
      const [dataToPlot,setDataToPlot]=useState([])
      const [nucleotidesData, setNucleotidesData] = useState([])

      const svgRef = useRef();
      useEffect(() =>
      {
        Object.keys(data).forEach(key => {
          var tagsJson = {};
          var tagKeys =  Object.keys(data[key].tags);
          tagKeys.forEach(tagKey => tagsJson[tagKey] = data[key].tags[tagKey])
           var numericJson = {};
          Object.keys(tagsJson).forEach( key => {
              if(typeof tagsJson[key] === "object") {
                  Object.keys(tagsJson[key]).forEach( innerKey => {
                             if(isNumeric(tagsJson[key][innerKey])){
                                  numericJson[innerKey] = tagsJson[key][innerKey];
                             }
                        })
                       
                  }
        })
         numericJsonArray.push(numericJson);
    });
  
 
  setNumericJsonArray(numericJsonArray)
        const w = 500;
        const h = 400;
        const svg = d3.select(svgRef.current)
              .attr("width", w)
              .attr("height", h)
              .style("overflow", "visible")
              .style("'margin-top'", "100px")

        const xScale =d3.scaleLinear()
             .domain([0,2000])
             .range([0,w])
        const yScale =d3.scaleLinear()
             .domain([0,2000])
             .range([h,0])
        
        const xAxis = d3.axisBottom(xScale).ticks(10);
        const yAxis = d3.axisLeft(yScale).ticks(10)
        svg.append('g')
        .call(xAxis)
        .attr('transform',`translate (0,${h})`);
        svg.append('g')
        .call(yAxis)
        
        svg.append('text')
        .attr('x',w/2)
        .attr('y',h + 50)
        .text('X Axis')
        svg.append('text')
        .attr('y',h/2)
        .attr('x',-100)
        .text('Y Axis')

        svg.selectAll()
          .data(dataToPlot)
          .enter()
          .append('circle')
            .attr('cx', d => xScale(d[0]))
            .attr('cy', d => yScale(d[1]))
            .attr('r',5)
      },[data]);

      
      function extractDataForXAxis(e){
        setSelectValueState(e.target.value); 
        let objectItem=e.target.value
        objectItem = objectItem.replace(/\s+/g,'').toString();
         const xAxisArray = []
         const finalItem = numericJsonArray.filter(item => {
          if(objectItem.toLowerCase().includes("jscore")){
            xAxisArray.push([item.JScore])
          }
          if(objectItem.toLowerCase().includes("vscore")){
            xAxisArray.push([item.VScore])
          }
          if(objectItem.toLowerCase().includes("readcount")){
            xAxisArray.push([item.ReadCount])
          }
          if(objectItem.toLowerCase().includes("receptoraveragequality")){
            xAxisArray.push([item.ReceptorAveragEquality])
          }
         })   
        setStateXAxis(xAxisArray)
        return xAxisArray
      }

      function extractDataForYAxis(e){
        setSelectValueState(e.target.value); 
        let objectItem=e.target.value;
        objectItem = objectItem.replace(/\s+/g,'').toString();     
        const yAxisArray = [];
         const finalItem = numericJsonArray.filter(item => {
          if(objectItem.toLowerCase().includes("jscore")){
            yAxisArray.push(item.JScore)
          }
          if(objectItem.toLowerCase().includes("vscore")){
            yAxisArray.push(item.VScore)
          }
          if(objectItem.toLowerCase().includes("readcount")){
            yAxisArray.push(item.ReadCount)
          }
          if(objectItem.toLowerCase().includes("receptoraveragequality")){
            yAxisArray.push(item.ReceptorAveragEquality)
          }
          return yAxisArray
         })
           
        setStateYAxis(yAxisArray)
        return yAxisArray       
      }

      function drawPlot(){
        console.log("draw");
        for (let i=0; i<stateXAxis.length; i++ ){
          var appendAxis = stateXAxis[i].push(stateYAxis[i]);
          setDataToPlot(stateXAxis);
        }
        return appendAxis        
      }

      function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }

 
        function displayNucleotides(){
          var nucleotidesData1 = [];
            Object.keys(data).forEach(key => {
              var tagsJson = {};
              var idKeys = Object.keys(data[key].id);     
              var tagKeys = Object.keys(data[key].tags);       
              tagKeys.forEach(tagKey => tagsJson[tagKey] = data[key].tags[tagKey])  
              var numericJson1 = {};
              Object.keys(tagsJson).forEach( key => {
                  if(typeof tagsJson[key] === "object") {
                      Object.keys(tagsJson[key]).forEach( innerKey => {
                        if(innerKey==='CDR3 Nucleotides'){
                          console.log("innner", innerKey);
                        numericJson1[innerKey] = tagsJson[key][innerKey];
                                }
                      })                                
                  }
            })
            numericJson1["id"] =data[key].id;
            nucleotidesData1.push(numericJson1);
            });
             console.log("DAAAAAAA",nucleotidesData1); 
             return nucleotidesData1;
            }
            const nucleotidesData2 = displayNucleotides()
// console.log("DA@",nucleotidesData2);
            // setNucleotidesData(nucleotidesData2)

  return (
    <div>  
      <h2>Choose x axis and y axis below to plot</h2>
      <div >
        <label htmlFor="xaxis">Choose x Axis:</label>
        <select id='select' onChange={extractDataForXAxis}>
          <option value='select'>--Select---</option>
          <option value='Read Count'>Read Count</option>
          <option value='J Score'>J Score</option>
          <option value='V Score'>V Score</option>
          <option value='Receptor Average Quality'>Receptor Average Quality</option>
        </select>
        <label htmlFor="yaxis">Choose y Axis:</label>
        <select onChange={extractDataForYAxis}>
        <option value='select'>--Select---</option>
        <option value='ReadCount'>Read Count</option>
          <option value='JScore'>J Score</option>
          <option value='VScore'>V Score</option>
          <option value='ReceptorAverageQuality'>Receptor Average Quality</option>
          
        </select>
        <button id='submit' onClick={drawPlot}>Submit</button>
        </div>    
      
      <div>
        
      <svg id="scale" ref={svgRef}></svg>
      </div>
 
      <div>
        <table id="dna-data">
          <thead id='table-head'>
            
            
          <tr><th>ID</th>
            <th>CDR3 Nucleotides</th></tr>

          </thead>

 <tbody>
   {nucleotidesData2.map((data, index) => {
     return(
       <tr key={index}><td>{data.id}</td>
       <td>{data["CDR3 Nucleotides"]}</td></tr>
       
     )
   })}
 </tbody>
  
         
        </table>
      </div>
    </div>
  )
}

export default ScatterPlot



// export function scaleLinear() {
//   throw new Error('Function not implemented.');
// }


// export function axisBottom(xScale: any) {
//   throw new Error('Function not implemented.');
// }


// export function axisLeft(yScale: any) {
//   throw new Error('Function not implemented.');
// }

