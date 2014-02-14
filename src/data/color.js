//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Sets color range of data, if applicable
//-------------------------------------------------------------------

d3plus.data.color = function(vars) {
  
  if (vars.color.key && typeof vars.color.key == "object") {
    if (vars.color.key[vars.id.key]) {
      var color_id = vars.color.key[vars.id.key]
    }
    else {
      var color_id = vars.color.key[Object.keys(vars.color.key)[0]]
    }
  }
  else {
    var color_id = vars.color.key
  }
  
  if (vars.data.value && color_id && vars.data.keys[color_id] == "number" && (vars.color.changed || vars.data.changed || vars.depth.changed || vars.time.solo.changed || vars.time.mute.changed)) {

    if (vars.dev.value) d3plus.console.group("Calculating Color Scale")

    if (vars.dev.value) d3plus.console.time("get data range")
  
    var data_range = []
    vars.data.pool.forEach(function(d){
      var val = parseFloat(d3plus.variable.value(vars,d,color_id))
      if (typeof val == "number" && !isNaN(val) && data_range.indexOf(val) < 0) data_range.push(val)
    })
    
    if (vars.dev.value) d3plus.console.timeEnd("get data range")
    
    if (data_range.length > 1) {
    
      var data_domain = null
    
      if (vars.dev.value) d3plus.console.time("create color scale")
      
      data_range = d3.extent(data_range)
    
      if (data_range[0] < 0 && data_range[1] > 0) {
        var color_range = vars.style.color.range
        data_range.push(data_range[1])
        data_range[1] = 0
      }
      else if (data_range[1] > 0 || data_range[0] < 0) {
        var color_range = vars.style.color.heatmap
        data_range = d3plus.utils.buckets(data_range,color_range.length)
      }
      else {
        var color_range = vars.style.color.range.slice(0)
      }
      
      vars.color_scale = d3.scale.sqrt()
        .domain(data_range)
        .range(color_range)
        .interpolate(d3.interpolateRgb)
  
      if (vars.dev.value) d3plus.console.timeEnd("create color scale")
      
    }
    else {
      vars.color_scale = null
    }
    
    if (vars.dev.value) d3plus.console.groupEnd()
    
  }
  
}
