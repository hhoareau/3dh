<template>
  <div>
    <div class="md-right">
      <md-button class="md-raised md-secondary" @click="selectAll(false)">Deselect</md-button>
      <md-button class="md-raised md-secondary" @click="selectAll(true)">Select</md-button>
      <md-button class="md-raised md-secondary" @click="selectAdvanced(20,80)">Optimal</md-button>
      <md-checkbox v-model="hideExcluded" @change="changeHide()">Hide exluded</md-checkbox>
    </div>

    <table id="data_table">
      <tr style="color:darkgray;"><td>Column</td><td>Default</td><td>Complexity</td><td>Type</td><td>Format</td></tr>
      <tr v-for="col in cols" v-bind:style="{color:col.color}">
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
    hideExcluded:boolean;

    constructor(){
        super();
        this.hideExcluded=false;
    }

    changeHide(){
        this.$forceUpdate();
    }

  updated(){
      //this.sendFormat();
  }

  mounted(){
      this.selectAdvanced();
      this.sendFormat();
  }



  sendFormat(){
      if(this.cols!=null && this.cols.length>0){
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

  changeHideExcluded(){
      this.$forceUpdate();
  }

  refreshStyle(){
      for(var i=0;i<this.cols.length;i++){
          if(this.cols[i].format=="exclude")
              this.cols[i].color="darkgray";
          else
              this.cols[i].color="white";
      }
  }

  selectAdvanced(max_default=20,min_complexity=80){
      for(var i=0;i<this.cols.length;i++){
          if(this.cols[i].Type!="index"){
              if(this.cols[i]["Complexity(%)"]>min_complexity && this.cols[i]["Empty(%)"]<max_default) {
                  this.cols[i].format = "measure";
              }else{
                  this.cols[i].format = "exclude";
              }
          }
      }
      this.refreshStyle();
      this.$forceUpdate();
      this.sendFormat();
  }

  selectAll(mode=true){
      for(var i=0;i<this.cols.length;i++){
          if(this.cols[i].Type!="index"){
              if(mode==true) {
                  this.cols[i].format = "measure";
              }else{
                  this.cols[i].format = "exclude";
              }
          }
      }
      this.refreshStyle();
      this.$forceUpdate();
      this.sendFormat();
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
