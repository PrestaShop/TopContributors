<template>
    <div id="arrow">
        <svg className="mask" viewBox="0 0 10 5" preserveAspectRatio="none">
            <g stroke="none" fill="#fff">
                <polygon points="-1 -1 -1 5 5 0 11 5 11 -1" />
            </g>
        </svg>
        <div className="words-count text-md-center">
            <div className="dot" />
            {{ counts }}
        </div>
    </div>
</template>

<style>
</style>

<script>
    export default{
        props(){
            return {
                message
            }
        },
        data(){
            console.log(this.message)
            return {
                counts: []
                /*counts: this.counts.forEach((value, i) => {
                  counts.push(
                    '<div key='+i+'>'+
                      '<div className="count">'+value+'</div>'+
                      '<div className="words">words</div>'+
                      '<div className="dot" />'+
                    '</div>'
                  )
                })*/
            }
        }
    }
</script>
