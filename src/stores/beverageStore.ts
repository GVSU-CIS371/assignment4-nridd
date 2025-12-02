import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import db from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],

    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,

    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,

    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,


    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,

    currentName: "",
  }),

  actions: {
    async init() {

      const baseSnap = await getDocs(collection(db, "bases"));
      this.bases = baseSnap.docs.map((d) => d.data() as BaseBeverageType);

      const creamerSnap = await getDocs(collection(db, "creamers"));
      this.creamers = creamerSnap.docs.map((d) => d.data() as CreamerType);

      const syrupSnap = await getDocs(collection(db, "syrups"));
      this.syrups = syrupSnap.docs.map((d) => d.data() as SyrupType);

      this.currentBase = this.bases[0] ?? null;
      this.currentCreamer = this.creamers[0] ?? null;
      this.currentSyrup = this.syrups[0] ?? null;

      const beveragesCollection = collection(db, "beverages");
      onSnapshot(beveragesCollection, (snapshot: QuerySnapshot<DocumentData>) => {
        this.beverages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BeverageType[];
      });
    },


    async makeBeverage() {
      if (!this.currentBase || !this.currentSyrup || !this.currentCreamer) {
        console.error("Cannot create beverage: missing ingredient");
        return;
      }
    
      const newBeverage: Omit<BeverageType, "id"> = {
        name: this.currentName || `${this.currentTemp} ${this.currentBase.name}`,
        temperature: this.currentTemp,
        base: this.currentBase,
        creamer: this.currentCreamer,
        syrup: this.currentSyrup,
      };
    
      await addDoc(collection(db, "beverages"), newBeverage);
    
      this.currentName = "";
    },


    showBeverage(id: string) {
      const bev = this.beverages.find((b) => b.id === id);
      if (!bev) return;
    
      this.currentBeverage = bev;
    
      this.currentTemp = bev.temperature;
      this.currentBase = bev.base;
      this.currentCreamer = bev.creamer;
      this.currentSyrup = bev.syrup;
    },
  },
});

