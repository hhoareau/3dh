<template>
  <div style="padding:0px;color:white;margin-left:10px;margin-right:10px;">
      <div style="margin:0px;" class="md-layout md-gutter md-alignment-top">
          <div class="md-layout-item md-xlarge-size-30 md-large-size-40 md-medium-size-40 md-small-size-100 md-xsmall-size-100">
              <div class="md-alignment-top-center">
                  <div class="md-layout">
                      <div class="md-layout-item md-size-40 md-alignment-center-left">
                          <span style="font-size: xx-large;">3DH</span>
                      </div>
                      <div style="font-size: large;font-weight: lighter;" class="md-layout-item md-size-40 md-alignment-center-left md-xlarge-size">
                          {{hourglass}}
                      </div>
                      <div style="font-size: small;" class="md-layout-item md-size-20 md-alignment-centered">
                          <md-progress-spinner v-if="hourglass.length>0" :md-diameter="40" :md-stroke="5" md-mode="indeterminate"></md-progress-spinner>
                      </div>
                  </div>
                  <md-snackbar :md-position="centered" :md-duration="4000" :md-active.sync="toast_message.length>0">
                      {{toast_message}}
                  </md-snackbar>

                  <br><br>
                  <md-card>
                      <md-card-header>
                          <div class="md-layout">
                              <div class="md-layout-item"><div class="md-title" style="text-align: left;">Datas / Files</div></div>
                              <div class="md-layout-item" style="text-align: right;">
                                  <md-button class="md-raised md-primary" @click="help()">Help</md-button>
                              </div>
                          </div>

                      </md-card-header>
                      <md-card-content>
                          <div class="md-layout">
                              <div class="md-layout-item">
                                  <md-field>
                                      <label>Files</label>
                                      <md-select v-model="selected_file" id="_file" name="_file" @md-selected="selectFile()">
                                          <md-option v-for="measure in measures" v-bind:value="measure">{{measure}}</md-option>
                                      </md-select>
                                  </md-field>
                              </div>
                              <div class="md-layout-item" style="text-align: right;">
                                  <md-button v-show="selected_file.length>0" class="md-raised md-secondary" @click="deleteFile()">Delete</md-button>
                                  <md-button v-show="measures.length>0" class="md-raised md-secondary" @click="randomFile()">Random</md-button>
                              </div>
                          </div>

                          <div class="md-layout">
                              <div class="md-layout-item">
                                  <label class="md-button md-primary md-alignment-center" for="_public_file"><md-icon>backup</md-icon>&nbsp;&nbsp;Public</label>
                                  <md-file style="visibility: hidden" id="_public_file" @md-change="upload($event,true)"/>
                              </div>
                              <div class="md-layout-item">
                                  <label class="md-button md-primary" for="_private_file"><md-icon>backup</md-icon>&nbsp;&nbsp;Private</label>
                                  <md-file style="visibility: hidden" id="_private_file" @md-change="upload($event,false)"/>
                              </div>
                          </div>

                          <md-button class="md-raised md-secondary" @click="analyseClipboard()">Analyse Clipboard</md-button>

                          <FileFormat v-if="selected_file.length>0 && type=='data'" v-on:format="updateFormat($event)" v-bind:cols="data_cols"></FileFormat>

                      </md-card-content>

                  </md-card>
                    <br>
                  <md-card v-if="selected_file.length>0">
                      <md-card-header>
                          <div class="md-layout">
                              <div class="md-layout-item"><div class="md-title" style="text-align: left;">Treatment</div></div>
                              <div class="md-layout-item" style="text-align: right;">
                                  <md-button class="md-raised md-primary" v-show="hourglass.length==0" @click="preview()">Preview</md-button>
                              </div>
                          </div>
                      </md-card-header>
                      <md-card-content>
                          <md-tabs md-sync-route>
                              <md-tab id="tab-cluster" md-label="Clustering" to="/components/tabs/Clustering">
                                  <div class="md-layout md-gutter">
                                      <div class="md-layout-item">
                                          <md-field>
                                              <md-select v-model="treatment" @md-selected="showParameters()">
                                                  <md-option value="NOTREATMENT::::">NOTREATMENT</md-option>

                                                  <md-option v-if="type=='data'" value="HDBSCAN::min_samples=2 min_cluster_size=3 alpha=0.5::https://hdbscan.readthedocs.io/en/latest/parameter_selection.html#">
                                                      HDBSCAN
                                                  </md-option>

                                                  <md-option v-if="type=='data'" value="NEURALGAS::passes=3 distance_toremove_edge=40::https://en.wikipedia.org/wiki/Neural_gas">
                                                      NEURALGAS
                                                  </md-option>

                                                  <md-option v-if="type=='data'" value="HAC::n_clusters=11,12,13::http://scikit-learn.org/stable/modules/generated/sklearn.cluster.AgglomerativeClustering.html">
                                                      HAC
                                                  </md-option>

                                                  <md-option v-if="type=='data'" value="MEANSHIFT::bandwidth=0.1,0.3,0.2::http://scikit-learn.org/stable/modules/generated/sklearn.cluster.MeanShift.html">
                                                      MEANSHIFT
                                                  </md-option>

                                                  <md-option v-if="type=='graph'" value="mod:: ::https://networkx.github.io/documentation/stable/reference/algorithms/generated/networkx.algorithms.community.modularity_max.greedy_modularity_communities.html#networkx.algorithms.community.modularity_max.greedy_modularity_communities">
                                                      Greedy Modularity
                                                  </md-option>

                                                  <md-option v-if="type=='graph'" value="async::k=5 max_iter=15::https://networkx.github.io/documentation/stable/reference/algorithms/generated/networkx.algorithms.community.asyn_fluid.asyn_fluidc.html#networkx.algorithms.community.asyn_fluid.asyn_fluidc">
                                                      Async Fluid
                                                  </md-option>

                                                  <md-option v-if="type=='graph'" value="GN:: ::https://networkx.github.io/documentation/latest/reference/algorithms/generated/networkx.algorithms.community.centrality.girvan_newman.html">
                                                      Girvan Newman
                                                  </md-option>

                                                  <md-option v-if="type=='graph'" value="lab:: ::https://networkx.github.io/documentation/latest/reference/algorithms/generated/networkx.algorithms.community.label_propagation.label_propagation_communities.html">
                                                      Label Propagation
                                                  </md-option>


                                              </md-select>
                                          </md-field>
                                      </div>
                                  </div>

                                  <div v-if="params.length>0" class="md-layout md-gutter md-alignment-center">
                                      <div v-for="param in params" class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                                          <md-field>
                                              <label>{{param.label}}</label>
                                              <md-input type="text" v-model="param.value"></md-input>
                                          </md-field>
                                      </div>
                                  </div>

                              </md-tab>
                              <md-tab v-if="type=='graph'" id="tab-graph" md-label="Graph" to="/components/tabs/graph">
                                  <div class="md-layout md-gutter">
                                      <div class="md-layout-item">
                                          <md-field>
                                              <md-select v-model="algo_loc">
                                                  <md-option value="fr">Fruchterman Reingold</md-option>
                                                  <md-option value="Circular">circular</md-option>
                                                  <md-option value="Spectral">spectral</md-option>
                                                  <md-option value="Random">random</md-option>
                                              </md-select>
                                          </md-field>
                                      </div>
                                  </div>

                              </md-tab>
                              <md-tab id="tab-convert" md-label="Convert" to="/components/tabs/converting">
                                  <div class="md-layout">
                                      <div class="md-layout-item md-size-30">
                                          <md-button v-if="type=='data'" class="md-raised md-secondary" @click="convertToGraph()">To graph</md-button>
                                      </div>
                                      <div class="md-layout-item md-size-70">
                                          <md-field>
                                              <label>Threshold distance</label>
                                              <md-input type="number" v-model="distance" step="0.02"></md-input>
                                          </md-field>
                                      </div>
                                  </div>

                                    <div class="md-layout">
                                      <div class="md-layout-item md-size-30">
                                          <md-button v-if="type=='data'" class="md-raised md-secondary" @click="convertToSubData()">To subData</md-button>
                                      </div>

                                  </div>


                              </md-tab>
                          </md-tabs>
                      </md-card-content>
                  </md-card>
                  <br>
                  <md-card v-if="selected_file.length>0">
                      <md-card-header>
                          <div class="md-layout">
                              <div class="md-layout-item"><div class="md-title" style="text-align: left;">Advanced</div></div>
                              <div class="md-layout-item" style="text-align: right;"><md-button class="md-raised md-primary" @click="openIn(showLink())">Execute</md-button></div>
                          </div>
                      </md-card-header>
                      <md-card-content>
                          <div class="md-layout">
                              <div class="md-layout-item md-size-20">
                                  <md-field>
                                      <label>Nb View</label>
                                      <md-input type="number" v-model="pca"></md-input>
                                  </md-field>
                              </div>
                              <div class="md-layout-item md-size-20">
                                  <md-field>
                                      <label>Limit</label>
                                      <md-input type="number" v-model="limit"></md-input>
                                  </md-field>
                              </div>
                          </div>
                          <div class="md-layout md-gutter">
                              <div class="md-layout-item"><md-checkbox v-model="notext" value="1">No text</md-checkbox></div>
                              <div class="md-layout-item"><md-checkbox v-model="nometrics" value="1">No metrics</md-checkbox></div>
                              <div class="md-layout-item"><md-checkbox v-model="add_property" value="1">Add Property</md-checkbox></div>
                              <div class="md-layout-item"><md-checkbox v-model="autorotate" value="1">Rotate</md-checkbox></div>
                          </div>

                      </md-card-content>
                  </md-card>
              </div>
          </div>
          <div class="md-layout-item md-xlarge-size-70 md-large-size-60 md-medium-size-60 md-small-size-100 md-xsmall-size-100">
              <!-- Toolbar -->
              <md-toolbar class="md-dense">
                  <md-button class="md-icon-button" @click="execCommand('a')"><md-icon >3d_rotation</md-icon></md-button>
                  <md-button class="md-icon-button" @click="execCommand('A')"><md-icon style="opacity: 0.4;" >3d_rotation</md-icon></md-button>

                  <md-button class="md-icon-button" @click="execCommand('s')"><md-icon>highlight</md-icon></md-button>
                  <md-button class="md-icon-button" @click="execCommand('S')"><md-icon style="opacity: 0.4;">highlight</md-icon></md-button>

                  <md-button class="md-icon-button" @click="execCommand('v')"><md-icon>videocam</md-icon></md-button>
                  <md-button class="md-icon-button" @click="execCommand('V')"><md-icon style="opacity: 0.4;">videocam</md-icon></md-button>

                  <md-button class="md-icon-button" @click="execCommand('n')"><md-icon>cloud</md-icon></md-button>
                  <md-button class="md-icon-button" @click="execCommand('N')"><md-icon style="opacity: 0.4;">cloud</md-icon></md-button>

                  <md-button class="md-icon-button" @click="execCommand('p')"><md-icon>crop_free</md-icon></md-button>
                  <md-button class="md-icon-button" @click="execCommand('P')"><md-icon style="opacity: 0.4;">crop_free</md-icon></md-button>

                  <md-button class="md-icon-button" @click="execCommand('+')"><md-icon>zoom_in</md-icon></md-button>
                  <md-button class="md-icon-button" @click="execCommand('-')"><md-icon>zoom_out</md-icon></md-button>

                  <md-button class="md-icon-button" @click="execCommand('E')">Save</md-button>

                  <div v-if="add_property=='1'">
                      <md-button class="md-toolbar-offset md-icon-button" @click="execCommand('0')">0</md-button>
                      <md-button class="md-icon-button" @click="execCommand('1')">1</md-button>
                      <md-button class="md-icon-button" @click="execCommand('2')">2</md-button>
                      <md-button class="md-icon-button" @click="execCommand('3')">3</md-button>
                      <md-button class="md-icon-button" @click="execCommand('4')">4</md-button>
                      <md-button class="md-icon-button" @click="execCommand('5')">5</md-button>
                      <md-button class="md-icon-button" @click="execCommand('6')">6</md-button>
                      <md-button class="md-icon-button" @click="execCommand('7')">7</md-button>
                      <md-button class="md-icon-button" @click="execCommand('8')">8</md-button>
                      <md-button class="md-icon-button" @click="execCommand('9')">9</md-button>
                  </div>

              </md-toolbar>
              <iframe style="padding:10px;background-color:lightgrey;border: none;min-height: 800px;" width="100%" height="1000" id="doc" name="out"></iframe>
          </div>
      </div>

  </div>
</template>

<script lang="ts">

import {HTTP,ROOT_API} from '../http-constants'
import { Component, Vue } from 'vue-property-decorator';
import FileFormat from "./FileFormat.vue"

@Component({name:"Files",components:{FileFormat}})
export default class Files extends Vue {
    selected_file="";
    toast_message:string="";
    data_cols:any[]=[];
    measures:string[]=[];
    distance:number=0.2;
    algo_loc:string="fr";
    limit:number=5000;
    treatment:string="NOTREATMENT::::";
    params: any[]=[];
    notif:string="";
    algo:string="";
    notext:string="1";
    nometrics:string="1";
    add_property:string="0";
    autorotate:string="1";
    pca:number=1;
    type:string="data";
    root_api:string=ROOT_API;
    format:string="";
    lastRender:number=0;
    hRender:any=null;
    hourglass:string="";
    rows=0;

  mounted(){
      this.refreshFiles();
  }

  refreshFiles(){
      this.hourglass="Files listing";
      HTTP.get('/datas/measures')
          .then(response => {
              this.measures = [];

              this.hourglass="";
              response.data.forEach((m:string)=>{
                  if(!m.startsWith("temp"))
                      this.measures.push(m);
              });
              if(this.measures.indexOf(this.selected_file)==-1){
                  if(this.measures.length>0)
                      this.randomFile();
                  else
                      this.selected_file="";
              }
          })
          .catch(e => {
              this.showMessage("Technical error");
          });
  }

    updateFormat(evt:any){
      this.format="index:"+evt.index+"_measures:"+evt.measure+"_properties:"+evt.prop;
    }

    preview(){
      this.openIn(this.showLink({autorotate:true,pca:1}),'out')
    }

    randomFile(){
        this.selected_file=this.measures[Math.trunc(Math.random()*this.measures.length)];
    }

    deleteFile(){
        this.hourglass="File deleting";
        HTTP.delete("/datas/measure/"+this.selected_file).then(r=>{
            this.refreshFiles();
        }).catch(e=>{
            this.hourglass="";
            this.showMessage("Treatment error");
        });
    }

    showMessage(s:string,delayInSec=4){
      this.toast_message=s;
      this.hourglass="";
      setTimeout(()=>{this.toast_message=""},delayInSec*1000);
    }


    raz(){
        this.selected_file="";
        this.algo="";
        this.algo_loc="fr";
    }

    selectFile(name:string=""){
      if(name.length>0)this.selected_file=name;
      if(this.selected_file.length>0){
          this.updateData(this.selected_file,()=>{
              this.preview();
          });
      }

    }

    analyseClipboard(){
      var nav:any=window.navigator;
        nav.clipboard.readText().then((text:string) => {
            if(text.startsWith("http"))
                this.updateData(text);
        });
    }

    convertToGraph(){
      this.hourglass="Converting to graphe";
      HTTP.get(ROOT_API+"tograph/"+this.selected_file+"?distance="+this.distance).then((r:any)=>{
          this.selected_file=r.data;
          this.refreshFiles();
      })
    }

    convertToSubData(){
        this.execCommand("E");
    }


    /**
     * Mise à jour des données sources
     * @param delayInSecBeforeRepresentation
     */
    updateData(url:string="",func:any=null){
        if(url.length==0)url=this.selected_file;

        if(url.replace("file:","").length>0){
            url=encodeURIComponent(url);
            var url_analyse=ROOT_API+"analyse?format=json&url="+url;
            this.hourglass="Data analyzing";
            HTTP.get(url_analyse).then((r:any)=>{
                this.hourglass="";
                this.data_cols=r.data.columns;
                this.rows=r.data.rows;
                this.type=r.data.type;
                for(var i=0;i<this.data_cols.length;i++){
                    this.data_cols[i].index="radio"+i;
                    this.data_cols[i].format=this.data_cols[i].Type;
                }
                if(func!=null)func();
            }).catch(()=>{
                this.showMessage("Technical Error");
            });
        }
    }


    help(){
        this.openIn("./help.html","out");
    }


    clearList(){
        this.selected_file="";
    }

    execCommand(key:string){
      var iframe:any=document.getElementsByName("out")[0];
      iframe.contentWindow.postMessage({key:key},"*");
    }


    showLink(options:any={}):string {
        var url_file=this.selected_file;
        if(url_file.length==0)return("");

        this.type="data";
        if(url_file.indexOf(".gml")>-1 || url_file.indexOf(".gexf")>-1 || url_file.indexOf(".gephi")>-1 || url_file.indexOf(".graphml")>-1 )this.type="graph";

        if(url_file.startsWith("http")) //Transformation pour assurer la transmission au serveur
            url_file="b64="+btoa(url_file);

        var rc=ROOT_API+"graph/"+url_file+"/"+this.algo_loc+"?algo_comm="+this.algo;
        if(this.type=="data"){
            var sParam="";
            this.params.forEach((p)=>{
                if(p.label!=null && p.label.length>0)
                    sParam=sParam+p.label+"="+p.value+"&";
            });
            if(sParam.length==0){
                sParam="noparam";
                this.algo="NO";
            }

            rc=ROOT_API+"job/"+url_file+"/"+this.algo+"/"+sParam+"?filter="+this.format;
        }

        console.log("ouverture de "+rc);

        //Ajout d'options supplémentaire sur l'url
        if(this.notif.length>0)rc+="&notif="+this.notif;

        // var format="";
        // if(format!=null){
        //     format=format.toLowerCase().replace("colonnes","cols").replace("col=","cols=").replace("index","name");
        //     for(var i=0;i<15;i++)
        //         format=format.replace(" ","_").replace(";","_");
        //
        //     format=format.replace("val=","measures=").replace("values=","measures=").replace("mesure=","measures=").replace("vals=","measures=").replace("mesures=","measures=").replace("artefact=","measures=");
        //     for(var i=0;i<10;i++)format=format.replace("=",":").replace("&","_");
        //     if(format.length>0)url+="&format="+format;
        //
        // }

        if(options.notext==null)options.notext=(this.notext=="1");
        if(options.nometrics==null)options.nometrics=(this.nometrics=="1");
        if(options.add_property==null)options.add_property=(this.add_property=="1");
        if(options.autorotate==null)options.autorotate=(this.autorotate=="1");
        if(options.limit==null)options.limit=this.limit;
        if(options.pca==null)options.pca=this.pca;


        for(var o in options)
            rc=rc+"&"+o+"="+options[o];

        for(var k=0;k<15;k++)rc=rc.replace("=true","=True").replace("=false","=False"); //Syntaxe imposée par python
        console.log("exec:"+rc);
        return rc;
    }

    showParameters(){
        this.openIn(this.treatment.split("::")[2],"out");
        this.algo=this.treatment.split("::")[0];
        this.params=[];
        this.treatment.split("::")[1].split(" ").forEach((p)=>{
            var param={label:p.split("=")[0],value:p.split("=")[1]};
            if(param.label!=null && param.label.length>0)this.params.push(param);
        });

        var doc=this.treatment.split("::")[2];

        if(this.algo=="NEURALGAS" && this.notif=="")this.notif="dev@f80.fr";
    }

    openIn(url:string,target="_blank",func:any=null){
        if(url.length>0){
            for(var k=0;k<15;k++)url=url.replace("=true","=True").replace("=false","=False"); //Syntaxe imposée par python

                this.hourglass="Treatment";

                window.open(url,target);
                document.getElementsByName("out")[0].addEventListener('load', ()=>{
                    this.hourglass="";
                    if(func!=null)func();
                }, false);


            this.lastRender=new Date().getTime();
        }
    }


    upload(evt:any,type:boolean){
      let f:File=evt[0];

      let fd=new FormData();
      fd.append("files",f);
      this.raz();
      this.hourglass="File uploading";
        HTTP.post("/datas/measure/"+f.name+"?public="+type,fd).then(r => {
                this.measures.push(f.name);
                this.selectFile(f.name);
                this.hourglass="";
            }).catch((r)=>{
                this.hourglass="";
        });
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
