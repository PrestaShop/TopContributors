<template>
    <div id="arrow">
        <svg class="mask" viewBox="0 0 10 5" preserveAspectRatio="none">
            <g stroke="none" fill="#fff">
                <polygon points="-1 -1 -1 5 5 0 11 5 11 -1" />
            </g>
        </svg>
        <div class="words-count text-md-center">
            <div class="dot" />
            <div v-for="(count, index) in counts">
                <div :rank="index">
                <div class="count">{{ count }}</div>
                <div class="words">contributions</div>
                <div class="dot" />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
</style>

<script>
    export default{
        name: 'Arrow',
        props: ['counts'],
    }
</script>
