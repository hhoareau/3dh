<template>
  <div style="padding:0px;color:white;">
      <div style="margin:0px;" class="md-layout md-gutter md-alignment-top">
          <div class="md-layout-item md-xlarge-size-30 md-large-size-40 md-medium-size-40 md-small-size-100 md-xsmall-size-100">
              <div class="md-alignment-top-left">
                  <div class="md-layout">
                      <div class="md-layout-item md-size-40 md-alignment-top-center text-center">
                          <div class="md-layout-item" style="margin-bottom: 10px;font-size: x-small;">
                              <span style="font-size: x-large;">{{config.name}}</span>
                              {{config.description}} - v{{config.version}}
                          </div>
                      </div>
                      <div style="font-size: small;font-weight: lighter;" class="md-layout-item md-size-40 md-alignment-center-left md-xlarge-size">
                          {{hourglass}}
                      </div>
                      <div class="md-layout-item md-size-20 md-alignment-centered">
                          <md-progress-spinner v-if="hourglass.length>0" :md-diameter="30" :md-stroke="5" md-mode="indeterminate"></md-progress-spinner>
                      </div>
                  </div>
                  <md-snackbar :md-position="centered" :md-duration="4000" :md-active.sync="toast_message.length>0">
                      {{toast_message}}
                  </md-snackbar>
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
                                      <label>Directory</label>
                                      <md-input type="text" v-model="dir" @blur="refreshFiles()"></md-input>
                                  </md-field>
                              </div>
                              <div class="md-layout-item">
                                  <md-button class="md-raised md-secondary" @click="generateSecureDir()">Secure Dir</md-button>
                              </div>
                              <div class="md-layout-item">
                                  <md-button class="md-raised md-secondary" @click="generatePublicDir()">Public Dir</md-button>
                              </div>
                          </div>
                          <div class="md-layout">
                              <div class="md-layout-item">
                                  <md-field v-if="url.length==0">
                                      <label>Files</label>
                                      <md-select v-model="selected_file" id="_file" name="_file" @md-selected="selectFile()">
                                          <md-option v-for="measure in measures" v-bind:value="measure">{{measure}}</md-option>
                                      </md-select>
                                  </md-field>
                                  <md-field v-if="url.length>0">
                                      {{url}}
                                  </md-field>
                              </div>
                              <div class="md-layout-item" style="text-align: right;" v-if="url.length==0">
                                  <md-button v-show="selected_file.length>0" class="md-raised md-secondary" @click="deleteFile()">Delete</md-button>
                                  <md-button v-show="measures.length>0" class="md-raised md-secondary" @click="randomFile()">Random</md-button>
                              </div>
                              <div class="md-layout-item" style="text-align: right;" v-if="url.length>0">
                                  <md-button class="md-raised md-secondary" @click="clearURL()">Clear</md-button>
                              </div>
                          </div>

                          <div class="md-layout md-gutter" v-if="url.length==0">
                              <div class="md-layout-item md-medium-size-33 md-small-size-33 md-xsmall-size-50">
                                  <label class="md-button md-primary" @click="analyseClipboard()"><md-icon>backup</md-icon>&nbsp;&nbsp;Paste</label>
                              </div>

                              <div class="md-layout-item md-medium-size-33 md-small-size-33 md-xsmall-size-50">
                                  <label class="md-button md-primary"  for="_private_file"><md-icon>backup</md-icon>&nbsp;&nbsp;Upload</label>
                                  <md-file style="visibility: hidden;height:0px;" id="_private_file" @md-change="upload($event)"/>
                              </div>
                          </div>

                          <FileFormat v-if="(selected_file.length>0 || url.length>0) && type=='data'" v-on:format="updateFormat($event)" v-bind:cols="data_cols"></FileFormat>

                      </md-card-content>

                  </md-card>
                    <br>
                  <md-card v-if="selected_file.length+url.length>0">
                      <md-card-header>
                          <div class="md-layout">
                              <div class="md-layout-item"><div class="md-title" style="text-align: left;">Treatment</div></div>
                              <div class="md-layout-item" style="text-align: right;">
                                  <md-button class="md-raised md-primary" v-show="hourglass.length==0" @click="preview()">Preview</md-button>
                              </div>
                          </div>
                      </md-card-header>
                      <md-card-content>
                          <md-tabs>
                              <md-tab id="tab-cluster" md-label="Clustering">
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
                                          <div class="md-layout-item">
                                          </div>
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

                                  <md-button class="md-raised md-secondary" v-show="type=='data' && hourglass.length==0" @click="reduce()">Reduce</md-button>

                              </md-tab>


                              <md-tab id="tab-convert" md-label="Convert">
                                  <div class="md-layout" v-if="type=='data'">
                                      <div class="md-layout-item md-size-30">
                                          <md-button class="md-raised md-secondary" @click="convertToGraph()">To graph</md-button>
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
                                          <md-button v-if="type=='graph'" class="md-raised md-secondary" @click="convertGraphToData()">To data</md-button>
                                      </div>

                                  </div>
                              </md-tab>



                              <md-tab v-if="type=='graph'" id="tab-graph" md-label="Graph">
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

                          </md-tabs>


                      </md-card-content>
                  </md-card>
                  <br>
                  <md-card v-if="selected_file.length+url.length>0">
                      <md-card-header>
                          <div class="md-layout">
                              <div class="md-layout-item"><div class="md-title" style="text-align: left;">Advanced</div></div>
                              <div class="md-layout-item" style="text-align: right;"><md-button class="md-raised md-primary" @click="openIn(showLink())">Share</md-button></div>
                          </div>
                      </md-card-header>
                      <md-card-content>
                          <div class="md-layout">
                              <div class="md-layout-item md-size-40">
                                  <md-field>
                                      <label>Nb View</label>
                                      <md-input type="number" v-model="pca"></md-input>
                                  </md-field>
                              </div>
                              <div class="md-layout-item md-size-20"></div>
                              <div class="md-layout-item md-size-40">
                                  <md-field>
                                      <label>Limit</label>
                                      <md-input type="number" v-model="limit"></md-input>
                                  </md-field>
                              </div>
                          </div>

                          <div class="md-layout">
                              <div class="md-layout-item md-size-40">
                                  <md-field>
                                      <label>Processors</label>
                                      <md-input type="number" v-model="processors"></md-input>
                                  </md-field>
                              </div>
                          </div>


                          <div class="md-layout md-gutter">
                              <div class="md-layout-item"><md-checkbox v-model="notext" value="1">No text</md-checkbox></div>
                              <div class="md-layout-item"><md-checkbox v-model="nometrics" value="1">No metrics</md-checkbox></div>
                              <div class="md-layout-item"><md-checkbox v-model="add_property" value="1">Add Property</md-checkbox></div>
                              <div class="md-layout-item"><md-checkbox v-model="autorotate" value="1">Auto Rotate</md-checkbox></div>
                          </div>
                            <br>
                          <div class="md-layout">
                              <div class="md-layout-item">
                                  <md-field>
                                      <label>Enter your email to be notify</label>
                                      <md-input type="email" v-model="notif"></md-input>
                                  </md-field>
                              </div>
                          </div>


                      </md-card-content>
                  </md-card>
              </div>

              <br>
              <div class="md-layout">
                  <div class="md-layout-item" style="font-size: small;">
                      <md-icon style="font-size: small;">computer</md-icon>&nbsp;{{server_api}}<br><br>
                      <a v-bind:href="config.homepage"><md-icon>home</md-icon></a><br>
                      {{config.name}} by {{config.author.name}}<br>
                      <md-icon>mail</md-icon>:{{config.author.email}}<br><br>
                      Licence : {{config.license}}
                  </div>
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

                  <div v-if="add_property=='1' || type=='graph'">
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
              <iframe style="padding:10px;background-color:lightgrey;border: none;min-height: 800px;height: 90vh" width="100%" id="doc" name="out"></iframe>
              <iframe
                      style="padding:10px;background-color:lightgrey;border: none;min-height: 800px;height: 300px"
                      width="100%" id="clusterView"
                      src="/treeview.html">
              </iframe>
          </div>
      </div>


  </div>
</template>

<script lang="ts">

    import {HTTP, ROOT_API, CONFIG} from '../http-constants'
    import { Component, Vue } from 'vue-property-decorator';
    import FileFormat from "./FileFormat.vue"
    import * as Cookies from 'es-cookie';
    import { Guid } from "guid-typescript";

@Component({name:"Files",components:{FileFormat}})
export default class Files extends Vue {
    selected_file="";
    toast_message:string="";
    config:any=CONFIG;
    data_cols:any[]=[];
    measures:string[]=[];
    distance:number=0.2;
    algo_loc:string="fr";
    limit:number=5000;
    treatment:string="NOTREATMENT::::";
    params: any[]=[];
    notif:string="";
    url:string="";
    algo:string="";
    notext:string="1";
    nometrics:string="1";
    add_property:string="0";
    autorotate:string="1";
    pca:number=1;
    type:string="data";
    format:string="";
    lastRender:number=0;
    dir:string="public";
    hRender:any=null;
    processors:number=2;
    hourglass:string="";
    rows=0;
    server_api=ROOT_API;

  mounted(){
      if(this.$route.query["api"]!=null)this.server_api=this.$route.query["api"];
      if(!this.server_api.startsWith("http"))this.server_api="http://"+this.server_api;
      if(!this.server_api.endsWith(":5000"))this.server_api=this.server_api+":5000";

      if(Cookies.get("dir")!=undefined)
          this.dir=""+Cookies.get("dir");

      this.refreshFiles();

      addEventListener("message",(evt:any)=> {
          if(typeof(evt.data)=="string"){
              console.log("Message:"+evt.data);
              if (evt.data.startsWith("message:")) this.hourglass = evt.data.replace("message:", "");
              if (evt.data == "event:loaded"){
                  this.hourglass="";
                  this.showClusters();
              }
          }
      });

  }

  refreshFiles(){
      this.hourglass="Files listing";
      HTTP.get(this.server_api+"/datas/measures?dir="+this.dir)
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

    showClusters(){
        var url=this.showLink({pca:0},"clusters");
        fetch(url).then((r)=>{return r.json()})
            .then((r)=>{
                var iframe:any=document.getElementById("clusterView");
                iframe.contentWindow.postMessage(r[0]);
            });
    }

    preview(){
      setTimeout(()=>{
          if(this.hourglass.length==0){
              this.hourglass="preview treatment";
              var iframe:any=document.getElementById("clusterView");
              iframe.contentWindow.location.reload();
              var url=this.showLink({autorotate:true,pca:1});
              console.log("Ouverture de "+url);
              this.openIn(url,'out')
          }
      },1000);
    }

    reduce(){
        this.openIn(this.showLink({autorotate:false,pca:1},"reduce"));
    }

    randomFile(){
        this.selected_file=this.measures[Math.trunc(Math.random()*this.measures.length)];
    }

    deleteFile(){
        this.hourglass="File deleting";
        HTTP.delete(this.server_api+"/datas/measure/"+this.selected_file+"?dir="+this.dir).then(r=>{
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
          this.treatment="NOTREATMENT::::";
          this.updateData(this.selected_file,()=>{this.preview();});
      }
    }

    analyseClipboard(){
      var nav:any=window.navigator;
        nav.clipboard.readText().then((text:string) => {
            if(text.startsWith("http")){
                this.updateData(text,()=>{
                    this.url=text;
                    this.preview();
                });
            } else {
                this.toast_message="Clipboard must contain an url (start with http)";
            }

        });
    }

    convertToGraph(){
      this.hourglass="Converting to graphe";
      HTTP.get(this.server_api+"/tograph/"+this.selected_file+"?distance="+this.distance).then((r:any)=>{
          this.selected_file=r.data;
          this.refreshFiles();
      })
    }

    convertToSubData(){
        this.execCommand("E");
    }

    convertGraphToData(){
        var url=this.server_api+"/todata/"+this.selected_file;
        this.openIn(url);
    }


    /**
     * Mise à jour des données sources
     * @param delayInSecBeforeRepresentation
     */
    updateData(url:string="",func:any=null){
        if(url.length==0)url=this.selected_file;

        if(url.replace("file:","").length>0){
            url=encodeURIComponent(url);
            var url_analyse=this.server_api+"/analyse?dir="+this.dir+"&format=json&url="+url;
            this.hourglass="Data analyzing";
            HTTP.get(url_analyse).then((r:any)=>{
                r=r.data;
                this.hourglass="";
                this.data_cols=r.columns
                this.rows=r.rows;
                this.type=r.type;
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
        this.openIn("./www/help.html","out");
    }

    clearList(){
        this.selected_file="";
    }

    execCommand(key:string){
      var iframe:any=document.getElementsByName("out")[0];
      iframe.contentWindow.postMessage({key:key},"*");
    }


    showLink(options:any={},service="graph"):string {
        var url_file=this.selected_file+this.url;
        if(url_file.length==0)return("");

        this.type="data";
        if(url_file.indexOf(".gml")>-1 || url_file.indexOf(".gexf")>-1 || url_file.indexOf(".gephi")>-1 || url_file.indexOf(".graphml")>-1 )this.type="graph";

        if(url_file.startsWith("http")) //Transformation pour assurer la transmission au serveur
            url_file="b64="+btoa(url_file);

        var rc=this.server_api+"/graph/"+url_file+"/"+this.algo_loc+"?algo_comm="+this.algo;
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

            rc=this.server_api+"/job/"+url_file+"/"+this.algo+"/"+sParam+"/"+service+"?filter="+this.format;
        }

        console.log("ouverture de "+rc);

        //Ajout d'options supplémentaire sur l'url
        if(this.notif.length>0)rc+="&notif="+this.notif;
        rc+="&dir="+this.dir;

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
        if(options.processors==null)options.processors=this.processors;


        for(var o in options)
            rc=rc+"&"+o+"="+options[o];

        for(var k=0;k<15;k++)rc=rc.replace("=true","=True").replace("=false","=False"); //Syntaxe imposée par python
        console.log("exec:"+rc);
        return rc;
    }

    showParameters(){
        //this.openIn(this.treatment.split("::")[2],"out");
        this.algo=this.treatment.split("::")[0];
        this.params=[];
        this.treatment.split("::")[1].split(" ").forEach((p)=>{
            var param={label:p.split("=")[0],value:p.split("=")[1]};
            if(param.label!=null && param.label.length>0)this.params.push(param);
        });

        var doc=this.treatment.split("::")[2];

        if(this.algo=="NEURALGAS" && this.notif=="")this.notif="dev@f80.fr";
    }

    clearURL(){
        this.url="";
    }

    openIn(url:string,target="_blank",func:any=null){
        if(url.length>0){
            for(var k=0;k<15;k++)url=url.replace("=true","=True").replace("=false","=False"); //Syntaxe imposée par python
            window.open(url,target);
            this.lastRender=new Date().getTime();
        }
    }

    generateSecureDir(){
        if(Cookies.get("dir")!=undefined){
            this.dir=""+Cookies.get("dir");
        }
        else{
            this.dir = ""+Guid.create();
            Cookies.set("dir",this.dir);
            for(let i=0;i<20;i++)this.dir=this.dir.replace("-","");
            this.refreshFiles();
        }

    }

    generatePublicDir(){
        this.dir = "public";
        this.refreshFiles();
    }

    upload(evt:any){
      let f:File=evt[0];

      let fd=new FormData();
      fd.append("files",f);
      this.raz();
      this.hourglass="File uploading";

        HTTP.post(this.server_api+"/datas/measure/"+f.name+"?dir="+this.dir,fd)
            .then(r => {
                if(f.name.endsWith("zip"))
                    this.refreshFiles();
                else{
                    this.measures.push(f.name);
                    this.selectFile(f.name);
                    this.hourglass="";
                }
            })
            .catch((r)=>{this.hourglass="";});
    }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
