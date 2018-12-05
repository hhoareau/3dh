<template>
  <div style="color:white;margin-left:10px;margin-right:10px;">
      <h1 >3DH</h1>
      3D representation & Data analysis<br><br>

    <div class="md-alignment-top-center">
        <md-card>
            <md-card-header>
                <div class="md-title">Files</div>
            </md-card-header>
            <md-card-content>
                <md-field>
                    <label>Files</label>
                    <md-select v-model="selected_file" id="_file" name="_file" @md-selected="selectFile()">
                        <md-option v-for="measure in measures" v-bind:value="measure">{{measure}}</md-option>
                    </md-select>
                </md-field>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item">
                        <md-field><label>Public</label><md-file v-model="file_public" @change="upload(true)"/></md-field>
                    </div>
                    <div class="md-layout-item">
                        <md-field><label>Private</label><md-file v-model="file_private" @change="upload(false)"/></md-field>
                    </div>
                </div>
                <br>

                <md-field>
                    <label>URL File</label>
                    <md-input type="text" v-model="url"></md-input>
                    <span class="md-helper-text">Get the url of the file to compute</span>
                </md-field>


            </md-card-content>
        </md-card>
        <br>
        <md-card v-if="url.length>0">
            <md-card-header>
                <div class="md-title">Treatment</div>
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
                            <div class="md-layout-item">
                                <md-button class="md-raised md-primary" @click="openIn(showLink(),'out')">Execute</md-button>
                                <md-button class="md-raised md-primary" @click="openIn(showLink())">Fullscreen</md-button>
                            </div>
                        </div>



                        <div class="md-layout md-gutter md-alignment-center">
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
        <md-card v-if="url.length>0">
            <md-card-header><div class="md-title">Print</div></md-card-header>
            <md-card-content>
                <md-field>
                    <label>Nb View</label>
                    <md-input type="number" v-model="pca"></md-input>
                </md-field>
                <br>
                <div class="md-layout md-gutter">
                    <div class="md-layout-item"><md-checkbox v-model="notext" value="1">No text</md-checkbox></div>
                    <div class="md-layout-item"><md-checkbox v-model="nometrics" value="1">No metrics</md-checkbox></div>
                    <div class="md-layout-item"><md-checkbox v-model="add_property" value="1">Add Property</md-checkbox></div>
                </div>
            </md-card-content>
        </md-card>

    </div>


  </div>
</template>

<script lang="ts">

import {HTTP} from '../http-constants'
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Files extends Vue {
    selected_file="";
    measures:string[]=[];
    file_public:any={};
    file_private:any={};
    url:string="";
    treatment:string="NOTREATMENT::::";
    params: any[]=[];
    notif:string="";
    algo:string="";
    notext:number=1;
    nometrics:number=1;
    add_property:number=1;
    pca:number=1;

  mounted(){
      HTTP.get('/datas/measures')
          .then(response => {
              this.measures = response.data;
              //if(this.measures.length>0)this.selected_file=this.measures[0];
          })
          .catch(e => {});
    }

    selectFile(){
      this.url=this.selected_file;
    }

    showLink(){
      debugger
        var url_file=this.url;
        if(this.url.startsWith("http"))
            url_file="b64="+btoa(this.url);

        var sParam="";
        this.params.forEach((p)=>{
            if(p.label!=null && p.label.length>0)
                sParam=sParam+p.label+"="+p.value+"&";
        });

        var baseURL="http://localhost:5000";
        let rc="http://"+baseURL+"/job/"+url_file+"/"+this.algo+"/"+sParam+"?&pca="+this.pca;
        if(url_file.endsWith(".gml") || url_file.endsWith(".gexf") || url_file.endsWith(".gephi") || url_file.endsWith(".graphml")){
            rc="http://"+baseURL+"/graph/"+url_file+"/fr?algo_comm=gn";
        }

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

        rc=rc+"&notext="+(this.notext==2);
        rc=rc+"&nometrics="+(this.nometrics==2);
        rc=rc+"&property="+(this.add_property==2);

        return rc;
    }

    showParameters(){
        this.algo=this.treatment.split("::")[0];
        this.params=[];
        this.treatment.split("::")[1].split(" ").forEach((p)=>{
            var param={label:p.split("=")[0],value:p.split("=")[1]};
            this.params.push(param);
        });

        var doc=this.treatment.split("::")[2];

        if(this.algo=="NEURALGAS" && this.notif=="")this.notif="dev@f80.fr";
    }

    openIn(url:string,target="_blank"){
      window.open(url,target);
    }

    upload(type:boolean){
      let f:File=this.file_public;
      if(!type)f=this.file_private;
        debugger
        HTTP.post("/datas/measure/"+this.selected_file+"?public="+type,f)
            .then(r => {
                this.url=f.name;
                this.measures.push(f.name);

            }).catch((r)=>{
            alert("Pas de connexion"+r);
        });
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
