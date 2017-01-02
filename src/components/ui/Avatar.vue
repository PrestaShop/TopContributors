<template>
    <div class="col-md-2 contributor simple-contributor">
        <div class="avatar">
            <img :src="contributor.avatar_url" />
        </div>
        <div class="details">
            <div class="fixed-height">
                <div class="name">{{ contributor.name }}</div>
                <div class="username">{{ contributor.login }}</div>
            </div>
            <div class="info">{{ contributor.contributions }} contrib.</div>
            <div class="position">#{{ contributor.rank }}</div>
        </div>
    </div>
</template>

<script>
export default{
    name: 'avatar',
    props: ['contributor']
}
</script>
