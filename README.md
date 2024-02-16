<a href="https://github.com/GameDev46" title="Go to GitHub repo">
    <img src="https://img.shields.io/static/v1?label=GameDev46&message=|&color=Green&logo=github&style=for-the-badge&labelColor=1f1f22" alt="GameDev46 - neuron_experiment">
    <img src="https://img.shields.io/badge/Version-0.4.3-green?style=for-the-badge&labelColor=1f1f22&color=Green" alt="GameDev46 - neuron_experiment">
</a>


![Static Badge](https://img.shields.io/badge/--1f1f22?style=for-the-badge&logo=HTML5)
![Static Badge](https://img.shields.io/badge/--1f1f22?style=for-the-badge&logo=CSS3&logoColor=6060ef)
![Static Badge](https://img.shields.io/badge/--1f1f22?style=for-the-badge&logo=JavaScript)
    
<a href="https://github.com/GameDev46/neuron_experiment/stargazers">
    <img src="https://img.shields.io/github/stars/GameDev46/neuron_experiment?style=for-the-badge&labelColor=1f1f22" alt="stars - neuron_experiment">
</a>
<a href="https://github.com/GameDev46/neuron_experiment/forks">
    <img src="https://img.shields.io/github/forks/GameDev46/neuron_experiment?style=for-the-badge&labelColor=1f1f22" alt="forks - neuron_experiment">
</a>
<a href="https://github.com/GameDev46/neuron_experiment/issues">
    <img src="https://img.shields.io/github/issues/GameDev46/neuron_experiment?style=for-the-badge&labelColor=1f1f22&color=blue"/>
 </a>

<br>
<br>

<div align="left">
<a href="https://gamedev46.github.io/neuron_experiment/">
    <img src="https://img.shields.io/badge/View_site-GH_Pages-2ea44f?style=for-the-badge&labelColor=1f1f22" alt="View site - GH Pages">
</a>
</div>

<br>

<p align="left">
<a href="https://twitter.com/gamedev46" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/twitter.svg" alt="gamedev46" height="30" width="40" /></a>
<a href="https://instagram.com/oliver_pearce47" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/instagram.svg" alt="oliver_pearce47" height="30" width="40" /></a>
<a href="https://www.youtube.com/c/gamedev46" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/youtube.svg" alt="gamedev46" height="30" width="40" /></a>
</p>

# neuron_experiment

Train your own neural networks in a custom world of your creation and the generation by generation watch them learn and develop into intelligent creatures. Why not even customise their attributes, such as their brain sizes, neuron count and their chance of mutation!  Can you evolve the ultimate creatures?

## Controlling the neurones

### Drawing tools

**Safe Zone** : This is where the neurons need to reach to be in the next generation

**Wall** : These pixels block neurons from travelling through them forcing them to go around

**Glue** : These pixels trap neurons making them unable to move to the safe zone

**Lava** : These pixels kill neuron eradicating them from the simulation

**Anti-spawn** : These pixels prevent neuron from spawning there at the beggining of each generation

**Eraser** : Removes pixels that have been placed down

**Creature Select** : Once selected if you click on the same pixel as a neuron it will display their stats in the top left hand display


### Settings

**Creatures Spawned** : The humber of neurons spawned in at the start of each generation

**Creature Neurons** : Determines the amount of neurons in the neural network, each number represents the number of neurons in a layer and they are seperated by commas to show each seperate layer (e.g. if the creature neurons was 6,10,8 the neural network would have 3 hidden layers where the first has 6 neurons, the second has 10 neurons and the third has 8 neurons)

**Creature Mutation Chance** : The chance that any one of the neurons weights will be randomly changed to hopefully make it better adapted to the task, the higher the slider the higher the chance of a mutation is

**Grid Width** : Determines the width in pixels of the map grid

**Grid Height** : Determines the height in pixels of the map grid

**Apply Changes** : Applies the settings to the simulation


### Survival rates

This tells you the percentage of thge population that made it to the safe zone in each generation (they must remain in the safe zone to be counted)
