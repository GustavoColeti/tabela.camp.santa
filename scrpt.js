let times=[

{
nome:"Flamengo",
cor:"#d50000",
pts:42,
j:20,
v:13,
e:3,
d:4,
gp:35,
gc:15
},

{
nome:"Palmeiras",
cor:"#1b5e20",
pts:40,
j:20,
v:12,
e:4,
d:4,
gp:32,
gc:16
},

{
nome:"Cruzeiro",
cor:"#0d47a1",
pts:39,
j:20,
v:12,
e:3,
d:5,
gp:30,
gc:18
},

{
nome:"Bahia",
cor:"#1565c0",
pts:36,
j:20,
v:11,
e:3,
d:6,
gp:28,
gc:20
},

{
nome:"Botafogo",
cor:"#111",
pts:34,
j:20,
v:10,
e:4,
d:6,
gp:27,
gc:21
},

{
nome:"São Paulo",
cor:"#ef5350",
pts:30,
j:20,
v:9,
e:3,
d:8,
gp:23,
gc:22
},

{
nome:"Corinthians",
cor:"#666",
pts:28,
j:20,
v:8,
e:4,
d:8,
gp:21,
gc:23
},

{
nome:"Grêmio",
cor:"#29b6f6",
pts:24,
j:20,
v:7,
e:3,
d:10,
gp:20,
gc:27
},

{
nome:"Fortaleza",
cor:"#1565c0",
pts:20,
j:20,
v:5,
e:5,
d:10,
gp:18,
gc:30
},

{
nome:"Santos",
cor:"#888",
pts:16,
j:20,
v:4,
e:4,
d:12,
gp:15,
gc:34
}

];

times.sort((a,b)=>b.pts-a.pts);

const tbody=document.querySelector("tbody");

times.forEach((t,i)=>{

let classe="";

if(i<4){
classe="liberta";
}
else if(i<6){
classe="sula";
}
else if(i<8){
classe="meio";
}
else{
classe="z4";
}

let saldo=t.gp-t.gc;

tbody.innerHTML+=`

<tr class="${classe}">

<td>${i+1}</td>

<td>

<div class="time">

<div class="escudo" style="background:${t.cor}"></div>

${t.nome}

</div>

</td>

<td><strong>${t.pts}</strong></td>

<td>${t.j}</td>

<td>${t.v}</td>

<td>${t.e}</td>

<td>${t.d}</td>

<td>${t.gp}</td>

<td>${t.gc}</td>

<td>${saldo}</td>

</tr>

`;

});