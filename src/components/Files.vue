<template>
  <div style="color:white;margin-left:10px;margin-right:10px;">
      <h1 >3DH</h1>
      3D representation & Data analysis<br><br>

      <div class="md-layout md-gutter md-alignment-top">
          <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
              <div class="md-alignment-top-center">
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
                                  <md-button class="md-raised md-secondary" @click="randomFile()">Random</md-button>
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

                          <md-field>
                              <label>URL File</label>
                              <md-input type="url" v-model="url" @change="updateUrl()" @focus="clearList()"></md-input>
                              <span class="md-helper-text">Get the url of the file to compute</span>
                          </md-field>


                      </md-card-content>
                  </md-card>
                  <br>
                  <md-card v-if="url.length+selected_file.length>0">
                      <md-card-header>
                          <div class="md-layout">
                              <div class="md-layout-item"><div class="md-title" style="text-align: left;">Treatment</div></div>
                              <div class="md-layout-item" style="text-align: right;">
                                  <md-button class="md-raised md-primary" @click="openIn(showLink({notext:true,nometric:true,add_property:false,autorotate:true}),'out')">Execute</md-button>
                              </div>
                          </div>

                      </md-card-header>
                      <md-card-content>
                          <md-tabs md-sync-route>
                              <md-tab id="tab-home" md-label="Clustering" to="/components/tabs/Clustering">
                                  <div class="md-layout md-gutter">
                                      <div class="md-layout-item">
                                          <md-field>
                                              <md-select v-model="treatment" @md-selected="showParameters()">
                                                  <md-option value="NOTREATMENT::::">NOTREATMENT</md-option>

                                                  <md-option value="HDBSCAN::min_samples=2 min_cluster_size=3 alpha=0.5::https://hdbscan.readthedocs.io/en/latest/parameter_selection.html#">
                                                      HDBSCAN
                                                  </md-option>

                                                  <md-option value="NEURALGAS::passes=3 distance_toremove_edge=40::https://en.wikipedia.org/wiki/Neural_gas">
                                                      NEURALGAS
                                                  </md-option>

                                                  <md-option value="HAC::n_clusters=11,12,13::http://scikit-learn.org/stable/modules/generated/sklearn.cluster.AgglomerativeClustering.html">
                                                      HAC
                                                  </md-option>

                                                  <md-option value="MEANSHIFT::bandwidth=0.1,0.3,0.2::http://scikit-learn.org/stable/modules/generated/sklearn.cluster.MeanShift.html">
                                                      MEANSHIFT
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
                              <md-tab id="tab-pages" md-label="Graphes" to="/components/tabs/graphes">

                              </md-tab>
                          </md-tabs>
                      </md-card-content>
                  </md-card>
                  <br>
                  <md-card v-if="selected_file.length+url.length>0">
                      <md-card-header>
                          <div class="md-layout">
                              <div class="md-layout-item"><div class="md-title" style="text-align: left;">Print</div></div>
                              <div class="md-layout-item" style="text-align: right;"><md-button class="md-raised md-primary" @click="openIn(showLink())">Result</md-button></div>
                          </div>
                      </md-card-header>
                      <md-card-content>
                          <div class="md-layout md-gutter">
                              <div class="md-layout-item">
                                  <md-field>
                                      <label>Nb View</label>
                                      <md-input type="number" v-model="pca"></md-input>
                                  </md-field>
                              </div>
                              <div class="md-layout-item">
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
                              <div class="md-layout-item"><md-checkbox v-model="autorotate" value="2">Rotate</md-checkbox></div>
                          </div>

                      </md-card-content>
                  </md-card>



              </div>
          </div>

          <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
              <iframe style="padding:10px;background-color:lightgrey;border: none;min-height: 800px;" width="100%" height="1000" id="doc" name="out"></iframe>
          </div>
      </div>

  </div>
</template>

<script lang="ts">

import {HTTP,ROOT_API} from '../http-constants'
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Files extends Vue {
    selected_file="";
    measures:string[]=[];
    url:string="";
    limit:number=1000000;
    treatment:string="NOTREATMENT::::";
    params: any[]=[];
    notif:string="";
    algo:string="";
    notext:number=1;
    nometrics:number=1;
    add_property:number=1;
    autorotate:number=2;
    pca:number=1;




  mounted(){
      HTTP.get('/datas/measures')
          .then(response => {
              this.measures = [];
              response.data.forEach((m:string)=>{
                  if(!m.startsWith("temp"))
                      this.measures.push(m);
                  this.randomFile();
              })
              //if(this.measures.length>0)this.selected_file=this.measures[0];
          })
          .catch(e => {});
    }



    randomFile(){
        this.url="";
        this.selected_file=this.measures[Math.trunc(Math.random()*this.measures.length)];
        this.updateUrl(0);
    }



    updateUrl(delayInSecBeforeRepresentation:number=2){
        var url=this.selected_file+this.url;
        if(url.length==0)return;

        if(url.replace("file:","").length>0){
            var url_analyse=ROOT_API+"analyse/"+url;
            this.openIn("./waiting_treatment.html?url="+encodeURI(url_analyse),"out");
            setTimeout(()=>{
                this.openIn(this.showLink({notext:true,nometrics:true,autorotate:true,add_property:true,limit:10000}),"out");
            },delayInSecBeforeRepresentation*1000+10);
        }
    }



    selectFile(){
      this.url="";
      this.updateUrl(2);
    }




    help(){
        this.openIn("./help.html","out");
    }


    clearList(){
        this.selected_file="";
    }



    showLink(options:any={}):string {
        var url_file=this.url+this.selected_file;
        if(url_file.length==0)return("");

        var type="data";
        if(url_file.indexOf(".gml")>-1 || url_file.indexOf(".gexf")>-1 || url_file.indexOf(".gephi")>-1 || url_file.indexOf(".graphml")>-1 )type="graph";

        if(url_file.startsWith("http")) //Transformation pour assurer la transmission au serveur
            url_file="b64="+btoa(url_file);

        var rc=ROOT_API+"graph/"+url_file+"/fr?algo_comm=gn";
        if(type=="data"){
            var sParam="";
            this.params.forEach((p)=>{
                if(p.label!=null && p.label.length>0)
                    sParam=sParam+p.label+"="+p.value+"&";
            });
            if(sParam.length==0){
                sParam="noparam";
                this.algo="NO";
            }

            rc=ROOT_API+"job/"+url_file+"/"+this.algo+"/"+sParam+"?&pca="+this.pca;
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

        if(options.notext==null)options.notext=(this.notext==2);
        if(options.nometrics==null)options.nometrics=(this.nometrics==2);
        if(options.add_property==null)options.add_property=(this.add_property==2);
        if(options.autorotate==null)options.autorotate=(this.autorotate==2);
        if(options.limit==null)options.limit=this.limit;


        for(var o in options)
            rc=rc+"&"+o+"="+options[o];

        for(var k=0;k<15;k++)rc=rc.replace("=true","=True").replace("=false","=False"); //Syntaxe imposée par python

        return rc;
    }

    showParameters(){
        this.algo=this.treatment.split("::")[0];
        this.params=[];
        this.treatment.split("::")[1].split(" ").forEach((p)=>{
            var param={label:p.split("=")[0],value:p.split("=")[1]};
            if(param.label!=null && param.label.length>0)this.params.push(param);
        });

        var doc=this.treatment.split("::")[2];

        if(this.algo=="NEURALGAS" && this.notif=="")this.notif="dev@f80.fr";
    }

    openIn(url:string,target="_blank"){
      for(var k=0;k<15;k++)url=url.replace("=true","=True").replace("=false","=False"); //Syntaxe imposée par python
      window.open(url,target);
    }


    upload(evt:any,type:boolean){
      let f:File=evt[0];

      let fd=new FormData();
      fd.append("files",f);
        HTTP.post(
            "/datas/measure/"+f.name+"?public="+type,
            fd
        ).then(r => {
                this.url=f.name;
                this.measures.push(f.name);
                this.selected_file=f.name;
                this.selectFile();
            }).catch((r)=>{
            alert("Pas de connexion"+r);
        });
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
