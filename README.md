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


## Website

You can use the program [here on its website](https://gamedev46.github.io/neuron_experiment/) or download the files and run it locally on your device!
