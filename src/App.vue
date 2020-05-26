<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style lang="scss">
::-webkit-scrollbar-track-piece {
	background-color: rgba(1,1,1,0); 
}
::-webkit-scrollbar {
	width: 8px;
	height: 8px;
	background-color: rgba(1,1,1,0); 
}
::-webkit-scrollbar-thumb { 
	border-radius: 7px;
	background-color: rgba(233,72,28,0.2);
}
</style>