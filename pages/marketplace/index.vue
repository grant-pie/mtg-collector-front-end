<template>
    <div class="container mx-auto px-4 py-6">
    <TradingMarketplace />
    </div>
</template>

<script setup>
import TradingMarketplace from '~/components/TradingMarketplace/TradingMarketplace.vue';

// Set page metadata
useHead({
title: 'Trading Marketplace - Card Collector',
meta: [
    { name: 'description', content: 'Find cards available for trade from other collectors' }
]
});
</script>