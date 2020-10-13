export default Vue.component('result', {
    props: ['activity', 'locations'],
    template:
        `<section id="output">
            <div id="outputTitle">
                <h2 v-text="activity.activity"></h2>
            </div>
            <div id="outputInfo">
                <p><b>Type:</b> {{ activity.type }}</p>
                <p><b>Participants:</b> {{ activity.participants }}</p>
                <p><b>Price:</b> {{ activity.price }}</p>
                <p><b>{{ locations }} locations found!</b></p>
            </div>
         </section>`
});