<template>
  <div>
    <Card v-for="card in pendingCards" @key="card.siret">
        <template v-slot:entete>
          <div>
            <ScoreWidget :prediction="prediction(card.siret)" :tooltip="true"/>
          </div>
        </template>
        <template v-slot:corps>
            <div class="ml-4">
                <span class="raison-sociale">
                    {{ card.raison_sociale }}
                </span><br/>
                <span>
                    {{ card.siret }}
                </span>
            </div>
        </template>
    </Card>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css"/>