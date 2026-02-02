<template>
  <div class="main-content">
    <breadcumb :page="$t('Opening_Stock')"" :folder="$t('Products')"/>
    <div v-if="isLoading" class="loading_page spinner spinner-primary mr-3"></div>

    <validation-observer ref="ref_Create_Stock" v-if="!isLoading">
      <b-form @submit.prevent="Submit_Stock">
        <b-row>
          <b-col lg="12" md="12" sm="12">
            <b-card>

               <!-- ALERT -->
              <!-- <b-alert variant="warning" show dismissible>
                📌 Import opening stock only works for <strong>Standard Single</strong> products.
              </b-alert> -->

              <b-row>
              
                <!-- warehouse -->
                <b-col lg="4" md="4" sm="12" class="mb-3">
                  <validation-provider name="warehouse" :rules="{ required: true}">
                    <b-form-group slot-scope="{ valid, errors }" :label="$t('warehouse') + ' ' + '*'">
                      <v-select
                        :class="{'is-invalid': !!errors.length}"
                        :state="errors[0] ? false : (valid ? true : null)"
                        v-model="warehouse_id"
                        :reduce="label => label.value"
                        :placeholder="$t('Choose_Warehouse')"
                        :options="warehouses.map(warehouses => ({label: warehouses.name, value: warehouses.id}))"
                      />
                      <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                 <!--Csv File -->
                <b-col lg="4" md="4" sm="12" class="mb-3">
                  <b-form-group label="Choose Csv File *">
                    <input type="file" @change="onFileSelected" label="Choose Csv File">
                    <b-form-invalid-feedback
                      id="File-feedback"
                      class="d-block"
                    >{{$t('field_must_be_in_csv_format')}}</b-form-invalid-feedback>
                  </b-form-group>
                </b-col>

                <!-- Example csv -->
                <b-col lg="4" md="4" sm="12" class="mb-3">
                  <b-button
                    :href="'/import/exemples/import_stock.csv'"
                    variant="info"
                    size="sm"
                    block
                  >{{ $t("Download_exemple") }}</b-button>
                </b-col>

                <b-col md="12">
                  <b-form-group>
                    <b-button variant="primary" @click="Submit_Stock" :disabled="SubmitProcessing"><i class="i-Yes me-2 font-weight-bold"></i> {{$t('submit')}}</b-button>
                    <div v-once class="typo__p" v-if="SubmitProcessing">
                      <div class="spinner sm spinner-primary mt-3"></div>
                    </div>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>

  </div>
</template>


<script>
import { mapActions, mapGetters } from "vuex";
import NProgress from "nprogress";

export default {
  metaInfo: {
    title: "Opening Stock Import"
  },
  data() {
    return {

      isLoading: true,
      SubmitProcessing:false,
      Submit_Processing_detail:false,
      data: new FormData(),
      warehouses: [],
      import_products: "",
      warehouse_id: "",
   
    };
  },
  computed: {
    ...mapGetters(["currentUserPermissions","currentUser"])
  },

  methods: {

    //------------------------------ Event Import Purchases -------------------------------\\
    onFileSelected(e) {
      this.import_products = "";
      let file = e.target.files[0];
      this.import_products = file;
    },


    //--- Submit Validate
    Submit_Stock() {
      this.$refs.ref_Create_Stock.validate().then(success => {
        if (!success) {
          this.makeToast(
            "danger",
            this.$t("Please_fill_the_form_correctly"),
            this.$t("Failed")
          );
        } else {
          this.Create_Stock();
        }
      });
    },
   
    //---Validate State Fields
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },

    //------ Toast
    makeToast(variant, msg, title) {
      this.$root.$bvToast.toast(msg, {
        title: title,
        variant: variant,
        solid: true
      });
    },


    //------------------------------Formetted Numbers -------------------------\\
    formatNumber(number, dec) {
      const value = (typeof number === "string"
        ? number
        : number.toString()
      ).split(".");
      if (dec <= 0) return value[0];
      let formated = value[1] || "";
      if (formated.length > dec)
        return `${value[0]}.${formated.substr(0, dec)}`;
      while (formated.length < dec) formated += "0";
      return `${value[0]}.${formated}`;
    },

 
    //--------------------------------- Create stock -------------------------\\
    Create_Stock() {
        this.SubmitProcessing = true;
        // Start the progress bar.
        NProgress.start();
        NProgress.set(0.1);
        var self = this;
       
        self.data.append("warehouse_id", self.warehouse_id);
        self.data.append("products", self.import_products);

        axios.post("opening_stock_import", self.data)
          .then(response => {
            // Complete the animation of theprogress bar.
            NProgress.done();

            this.makeToast(
              "success",
              this.$t("Successfully_Imported"),
              this.$t("Success")
            );

            this.SubmitProcessing = false;
            this.$router.push({ name: "index_products" });
          })
          .catch(error => {
            NProgress.done();
            this.makeToast("danger", 'An error occurred while processing the CSV file.', this.$t("Failed"));
            this.SubmitProcessing = false;
          });
    },

 

 

    //---------------------------------------Get Elements ------------------------------\\
    GetElements() {
      axios
        .get("get_import_stock")
        .then(response => {
          this.warehouses = response.data.warehouses;
          this.isLoading = false;
        })
        .catch(response => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    }
  },

  //-----------------------------  Created function-------------------
  created() {
    this.GetElements();
  }
};
</script>