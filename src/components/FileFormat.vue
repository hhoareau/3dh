<template>
  <div>
    <md-button class="md-raised md-secondary" @click="selectAll(false)">Deselect</md-button>
    <md-button class="md-raised md-secondary" @click="selectAll(true)">Select</md-button>

    <table id="data_table">
      <tr><td>Column</td><td>Default</td><td>Complexity</td><td>Type</td><td>Format</td></tr>
      <tr v-for="col in cols">
        <td>{{col.Names}}</td>
        <td>{{col["Empty(%)"]}}%</td>
        <td>{{col["Complexity(%)"]}}%</td>
        <td>{{col["dataType"]}}</td>
        <td>
          <select style="background: grey;color:white;border:none;" v-bind:id="col.index" v-bind:value="col.format" @change="sendFormat()">
            <option value="measure">Measure</option>
            <option value="prop">Property</option>
            <option value="exclude">Exclude</option>
            <option value="index">Index</option>
          </select>
        </td>
      </tr>
    </table>
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({name:"FileFormat"})
export default class FileFormat extends Vue {
  @Prop() cols:any[]=[];
  format:string="";

  updated(){
      this.sendFormat();
  }

  sendFormat(){
      if(this.cols.length>0){
          var format:any={index:"",prop:"",measure:""};
          var i=0;
          this.cols.forEach(col=>{
              var elt:any=document.getElementById(col.index);
              format[elt.value]=format[elt.value]+i+",";
              i=i+1;
          });
          this.$emit("format",format);
      }
  }

  selectAll(mode=true){
      for(var i=0;i<this.cols.length;i++){
          if(this.cols[i].Type!="index"){
              if(mode==true) {
                  this.cols[i].Type = "measure";
              }else{
                  this.cols[i].Type = "exclude";
              }
          }
      }
      this.sendFormat();
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
