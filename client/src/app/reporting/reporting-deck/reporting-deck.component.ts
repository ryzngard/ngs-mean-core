import { Component, OnInit, Input } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { TeamService } from 'src/app/services/team.service';
import {merge} from 'lodash';

@Component({
  selector: 'app-reporting-deck',
  templateUrl: './reporting-deck.component.html',
  styleUrls: ['./reporting-deck.component.css']
})
export class ReportingDeckComponent implements OnInit {
   
  hideButton:boolean=false;
  recMatch = {
    away:{logo:null,teamName:''},
    home: { logo: null, teamName: ''},
    mapBans: {
      away: '',
      home: ''
    },
    other:{},
    reported:false,
    replays:{},
    matchId:''
  }

  uploading = false;

  @Input() set match(match){
    if(match!=null && match != undefined){
      
      merge( this.recMatch, match);
      
    }
    if(this.recMatch.other != null && this.recMatch.mapBans != undefined){
      this.games = this.recMatch.other;
    }
    if(this.recMatch.mapBans != null && this.recMatch.mapBans != undefined){
      this.mapBans = this.recMatch.mapBans;
    }
    
    if(this.recMatch.reported){
      this.hideButton = true;
      this.formControlsDisable();
      
    }
  }
  constructor(private scheduleService: ScheduleService, private util: UtilitiesService, public team:TeamService) { }
    
  maps = {
  ControlPoints: 'Sky Temple',
  TowersOfDoom: 'Towers of Doom',
  // HauntedMines: 'Haunted Mines',
  BattlefieldOfEternity: 'Battlefield of Eternity',
  // BlackheartsBay: "Blackheart's Bay",
  CursedHollow: 'Cursed Hollow',
  DragonShire: 'Dragon Shire',
  // HauntedWoods: 'Garden of Terror',
  Shrines: 'Infernal Shrines',
  Crypts: 'Tomb of the Spider Queen',
  Volskaya: 'Volskaya Foundry',
  // 'Warhead Junction': 'Warhead Junction',   // blizz why
  BraxisHoldout: 'Braxis Holdout',
  Hanamura: 'Hanamura',
  AlteracPass: 'Alterac Pass'
};

removeBan(hero, arr){
  let ind = arr.indexOf(hero);
  if(ind!=-1){
    arr = arr.splice(ind, 1);
  }
}
  
  mapBans = {
    away:'',
    home:''
  };
  games = {};
  showAdd:boolean = true;
  showReport:boolean = false;
  addGame(){
    let keys = Object.keys(this.games);
    if(keys.length<3){
      this.games[(keys.length + 1).toString()] = {
        homeBans: [],
        awayBans: [],
        winner: '',
        replay: null,
        tmp: {}
      };
    }
    if (keys.length >= 1) {
      this.showReport = true;
    }
    if(keys.length>=2){
      this.showAdd=false;
    }

  }

  returnFilteredHeroes(game){
    let disArr = [];
    let currentArr = game.value.homeBans.concat(game.value.awayBans);
    let keys = Object.keys(this.heroes);
    keys.forEach(element=>{
      let heroName = this.heroes[element];
      if(currentArr.indexOf(heroName)==-1){
        disArr.push(this.heroes[element]);
      }
    });
    return disArr;
  }

  heroes = {
    "Abat": "Abathur",
    "Alar": "Alarak",
    "Alex": "Alexstrasza",
    "HANA": "Ana",
    "Anub": "Anub'arak",
    "Arts": "Artanis",
    "Arth": "Arthas",
    "Auri": "Auriel",
    "Azmo": "Azmodan",
    "Fire": "Blaze",
    "Faer": "Brightwing",
    "Amaz": "Cassia",
    "Chen": "Chen",
    "CCho": "Cho",
    "Chro": "Chromie",
    "DECK": "Deckard",
    "Deha": "Dehaka",
    "Diab": "Diablo",
    "DVA0": "D.Va",
    "L90E": "E.T.C.",
    "Fals": "Falstad",
    "FENX": "Fenix",
    "Gall": "Gall",
    "Garr": "Garrosh",
    "Tink": "Gazlowe",
    "Genj": "Genji",
    "Genn": "Greymane",
    "Guld": "Gul'dan",
    "Hanz": "Hanzo",
    "Illi": "Illidan",
    "Jain": "Jaina",
    "Crus": "Johanna",
    "Junk": "Junkrat",
    "Kael": "Kael'thas",
    "KelT": "Kel'Thuzad",
    "Kerr": "Kerrigan",
    "Monk": "Kharazim",
    "Leor": "Leoric",
    "LiLi": "Li Li",
    "Wiza": "Li-Ming",
    "Medi": "Lt. Morales",
    "Luci": "Lucio",
    "Drya": "Lunara",
    "Maie": "Maiev",
    "Malf": "Malfurion",
    "Malg":"Mal'Ganis",
    "MALT": "Malthael",
    "Mdvh": "Medivh",
    "Mura": "Muradin",
    "Murk": "Murky",
    "Witc": "Nazeebo",
    "Nova": "Nova",
    "Oprh":"Orphea",
    "Prob": "Probius",
    "Ragn": "Ragnaros",
    "Rayn": "Raynor",
    "Rehg": "Rehgar",
    "Rexx": "Rexxar",
    "Samu": "Samuro",
    "Sgth": "Sgt. Hammer",
    "Barb": "Sonya",
    "Stit": "Stitches",
    "STUK": "Stukov",
    "Sylv": "Sylvanas",
    "Tass": "Tassadar",
    "Butc": "The Butcher",
    "Lost": "The Lost Vikings",
    "Thra": "Thrall",
    "Tra0": "Tracer",
    "Tych": "Tychus",
    "Tyrl": "Tyrael",
    "Tyrd": "Tyrande",
    "Uthe": "Uther",
    "VALE": "Valeera",
    "Demo": "Valla",
    "Vari": "Varian",
    "Necr": "Xul",
    "YREL": "Yrel",
    "Zaga": "Zagara",
    "Zary": "Zarya",
    "Zera": "Zeratul",
    "ZULJ": "Zul'jin"
  }

addBan(hero, arr){
  arr.push(hero);
  hero=null;
}

resetReplay(game){
  game.value.replay=null;
}

  formControlsDisable(){
    this.awayScoreControl.disable();
    this.homeScoreControl.disable();
    this.replay1Control.disable();
    this.replay2Control.disable();
  }

  hideReplaySubmit(){
    if(this.recMatch.replays){
      return false;
    }else{
      return true;
    }
    
  }

  removeGame(game, games){
    delete games[game];
  }

  awayScoreControl = new FormControl('', [
    Validators.required
  ]);
  homeScoreControl = new FormControl('', [
    Validators.required
  ]);
  replay1Control = new FormControl('', [
    Validators.required
  ]); 
  replay2Control = new FormControl('', [
    Validators.required
  ]);
  replay3Control = new FormControl('', [
    Validators.required
  ]);

  reportForm = new FormGroup({
    awayScore: this.awayScoreControl,
    homeScore: this.homeScoreControl,
    replay1: this.replay1Control,
    replay2: this.replay2Control
  })

  ngOnInit() {
    this.util.markFormGroupTouched(this.reportForm);
  }

  homeScore: number
  awayScore: number
  replay1:any
  replay2:any
  replay3:any

  thirdReplayRequired:boolean = false;

  scoreSelected(changed) {
   if(this.homeScore + this.awayScore > 2){
     this.thirdReplayRequired = true;
   }else{
     this.thirdReplayRequired = false;
     this.replay3 = null;
   }
  }

  scoreError:string ='';
  disableSubmit():boolean{
    let disable = true;

    if(this.homeScore == 2){
      if(this.awayScore <= 1){
        disable = false;
        this.scoreError = '';
      }else{
        disable = true;
        this.scoreError = 'Invalid Score';
      }
    }else if(this.homeScore == 1){
      if(this.awayScore == 2){
        disable = false;
        this.scoreError = '';
      }else{
        disable = true;
        this.scoreError = 'Invalid Score';
      }
    }else if(this.homeScore == 0){
      if(this.awayScore == 2){
        disable = false;
        this.scoreError = '';
      }else{
        disable = true;
        this.scoreError = 'Invalid Score';
      }
    }

    if (this.thirdReplayRequired) {
      if (this.homeScore != null && this.awayScore != null && this.replay1 != null && this.replay2 != null && this.replay3 != null) {
        disable = false;
      }else{
        disable = true;
      }
    } else {
      if (this.homeScore != null && this.awayScore != null && this.replay1 != null && this.replay2 != null) {
        disable = false;
      }else{
        disable = true;
      }
    }
    
    return disable;
  }

  show:boolean=false;

  showHide(){
    this.show = !this.show;
  }

  report() {  

    let submittable = true;

    let report = {
      matchId:this.recMatch.matchId,
      homeTeamScore:0,
      awayTeamScore:0
    };
    let otherData = {};

    let keys = Object.keys(this.games);
    keys.forEach(key => {
      let game = this.games[key];
      if(game.winner == 'home'){
        report.homeTeamScore+=1;
      }else if(game.winner == 'away'){
        report.awayTeamScore+=1;
      }else{
        submittable = false;
        alert('Game ' + key + ' winner is not selected, can not submit.');
      }
      
      if (game.replay == null && game.replay == undefined){
          submittable = false;
          alert('Game ' + key + ' replay is not attached, can not submit.');
        }
      
      report['replay'+key.toString()]=game.replay;

      let gamenum = key.toString();
      if(game.homeBans.length<3){
        alert('Game ' + key + ' home bans is not filled, can not submit.');
        submittable = false
      }
      if (game.awayBans.length < 3) {
        alert('Game ' + key + ' away bans is not filled, can not submit.');
        submittable = false
      }
      otherData[gamenum]={
        awayBans:game.awayBans,
        homeBans:game.homeBans,
        winner : game.winner
      }
    });

    if (report.homeTeamScore == 1 && report.awayTeamScore == 1 || report.awayTeamScore == 1 && report.homeTeamScore == 1){
      submittable = false;
      alert('This out come is not allowed, matches must end 2-0 or 2-1');
    }

    report['otherDetails']=JSON.stringify(otherData);
    report['mapBans']=JSON.stringify(this.mapBans);


    if(submittable){
      this.uploading=true;
      this.scheduleService.reportMatch(report).subscribe( res=>{
        this.uploading=false;
        this.recMatch.reported = true;
        this.showReport = false;
      },
      err=>{
        this.uploading = false
        console.log(err);
      })
    }  

  }

}
