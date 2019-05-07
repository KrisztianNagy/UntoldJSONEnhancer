# Untold JSON Enhancer

The JSON Enhancer was created to add calculated fields into an existing JSON object.

## Installing

The library is currently WIP.

## Usage

For the purpose of this example we will write queries for the [Character](test/data/character.ts) JSON object.

## Setting up the enhancer

First, import the json enhancer library.

For the web:

```javascript
import JSONEnhancer from 'untold-json-enhancer';
```

In node:

```javascript
const JSONEnhancer = require('untold-json-enhancer');
```

Next, you should create a new instance from the JSON Enhancer:

```javascript
const enhancer = new JSONEnhancer();
```

## Creating a schema

A schema represents a group of enhancements which will be applied at once on an object.

In the following example we create a new schema for our character object and use it to enhance its properties.

```javascript
enhancer.setSchema('Character');

// TODO: add your own rules

enhancer.enhance(character, 'Character');
```

If we execute this code we will realize that it does nothing because our schema is empty.

## Creating a static rule

Rules can be added with the _addRuleToSchema_ method. It expects 3 parameters:

-   The name of the schema
-   An [Untold JSON Pointer](https://github.com/KrisztianNagy/UntoldJSONPointer) query to specify the target or targets.
-   The new value

The [Untold JSON Pointer](https://github.com/KrisztianNagy/UntoldJSONPointer) is query library designed to help us target properties in an object. The only
difference you have to notice that it always starts with the _._ character. You can read more about it on its own GitHub page.

In the following example we create a rule which points to the name of the weapon and renames it from sword to stick.

```javascript
console.log(character.weapon.name); // "sword"

enhancer.setSchema('Character');
enhancer.addRuleToSchema('Character', '.weapon.name', '"stick"');
enhancer.addRuleToSchema('Character', '.weapon.price', '2 * 8');

enhancer.enhance(character, 'Character');

console.log(character.weapon.name); // "stick"
console.log(character.weapon.price); // 16
```

## Using rule scoped variables to calculate value based on context

There are 3 variables available for you in the value expression.

### item

The _item_ points to the original object. It is useful when you want to use absolute path to navigate.

```javascript
console.log(character.name); // "Conan"
console.log(character.weapon.name); // "sword"

enhancer.setSchema('Character');
enhancer.addRuleToSchema('Character', '.weapon.name', 'item.name');

enhancer.enhance(character, 'Character');

console.log(character.name); // "Conan"
console.log(character.weapon.name); // "Conan"
```

### target

The _target_ points to property what we are planning to update.

```javascript
console.log(character.weapon.name); // "sword"

enhancer.setSchema('Character');
enhancer.addRuleToSchema('Character', '.weapon.name', 'target.name + "2"');

enhancer.enhance(character, 'Character');

console.log(character.weapon.name); // "sword2"
```

### parent

The _parent_ object has 2 properties:

-   value - which is the reference to the parent
-   parent - which goes up on the chain.

So you can get the reference of the grandparent by using the _parent.parent.value_.

```javascript
console.log(character.name); // "Conan"
console.log(character.weapon.name); // "sword"

enhancer.setSchema('Character');
enhancer.addRuleToSchema('Character', '.weapon.name', 'parent.parent.value.name');

enhancer.enhance(character, 'Character');

console.log(character.name); // "Conan"
console.log(character.weapon.name); // "Conan"
```

## Adding your own context variables

You can add context variables globaly or only into the schema.

```javascript
console.log(character.name); // "Conan"

enhancer.setGlobalScope({ globalTitle: 'Global' });

enhancer.setSchema('Character');
enhancer.setSchemaScope('Character', { schemaTitle: 'Schema' });
enhancer.addRuleToSchema('Character', '.name', 'globalTitle + " " + schemaTitle');

enhancer.enhance(characterCopy, 'Character');

console.log(character.name); // "Global Schema"
```

Please keep in mind that in case of duplicate variable names, the more specific always wins.

## Adding helper methods and using pipes

You can inject anything into the scope and use them.

```javascript
enhancer.setGlobalScope({ Math: Math };

enhancer.setSchema('Character');
enhancer.addRuleToSchema('Character', '.weapon.price', 'Math.floor(2.4)');

console.log(character.weapon.price); // 2
```

Also if the function only takes one parameter you can use the pipe shorthand.

```javascript
enhancer.addRuleToSchema('Character', '.weapon.price', '2.4 | Math.floor');
```

## Nested schema

You can also create schemas for common parts in other schemas to avoid redundancy.

Here, the character has an item array and we would like to add a new property to each item which is calculated based on that properties of that item.

```javascript
enhancer.setSchema('Character');

enhancer.setSchema('Item');
enhancer.addRuleToSchema('Item', '.sumWeight', 'parent.value.weight * parent.value.quantity');

enhancer.addSchemaToSchema('Character', '.items', 'Item');

enhancer.enhance(characterCopy, 'Character');

console.log(characterCopy.items[0].sumWeight)); // 1
console.log(characterCopy.items[1].sumWeight)); // 3
console.log(characterCopy.items[2].sumWeight)); // 2
console.log(characterCopy.items[3].sumWeight)); // 0.5
```

It is important to notice that we applied our nested schema to an array and that's why the enhancer applied the schema to every single element.
