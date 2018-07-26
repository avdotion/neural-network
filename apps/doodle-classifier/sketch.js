const total = 1000;
const divider = 0.8;

let data = {
  cat: {},
  pencil: {},
  sock: {}
}

let brain;

function preload() {
  for (let doodle in data) {
    data[doodle].imported = loadBytes('doodles/' + doodle + '.bin');
  }
}

function setup() {
  createCanvas(280, 280);
  background(0);

  let prepareData = (dataset, total_data, midpoint, label) => {
    dataset.training = [];
    dataset.testing = [];
    let threshold = floor(midpoint * total);

    for (let i = 0; i < threshold; i++) {
      let offset = i * 28 ** 2;
      dataset.training.push(dataset.imported.bytes.subarray(offset, offset + 28 ** 2));
      dataset.training[i].label = label;
    }

    for (let i = threshold; i < total_data; i++) {
      let offset = i * 28 ** 2;
      dataset.testing.push(dataset.imported.bytes.subarray(offset, offset + 28 ** 2));
      dataset.testing[i - threshold].label = label;
    }
  }

  let display = (data, total) => {
    for (let n = 0; n < total; n++) {
      let img = createImage(28, 28);
      img.loadPixels();
      let offset = n * 28 ** 2;
      for (let i = 0; i < 28 ** 2; i++) {
        img.pixels[i * 4 + 0] = 255 - data.bytes[i + offset];
        img.pixels[i * 4 + 1] = 255 - data.bytes[i + offset];
        img.pixels[i * 4 + 2] = 255 - data.bytes[i + offset];
        img.pixels[i * 4 + 3] = 255;
      }
      img.updatePixels();
      let x = (n % 10) * 28;
      let y = floor(n / 10) * 28;
      image(img, x, y);
    }
  }

  // Preparing data (separating training from testing dataset)
  for (let doodle in data) {
    prepareData(data[doodle], total, divider, doodle);
  }

  // What the training data is
  let training = [];
  for (let doodle in data) {
    training = training.concat(data[doodle].training);
  }
  shuffle(training, true);

  // What the testing data is
  let testing = [];
  for (let doodle in data) {
    testing = testing.concat(data[doodle].testing);
  }

  // Loading up the neural network
  brain = new NeuralNetwork(28 ** 2, 2 ** 6, 3);

  // Training the neural network
  let trainOnDoodles = () => {
    for (let doodle of training) {
      let inputs = Array.from(doodle).map(x => x / 255);

      let targets = new Array();
      for (let key in data) {
        // Weird hack (maybe) for Object.indexOf()
        targets.push(int(key === doodle.label));
      }

      brain.train(inputs, targets);
    }
  };

  // Test all
  let testIt = () => {
    let correct_predictions = 0;
    for (let doodle of testing) {
      let inputs = Array.from(doodle).map(x => x / 255);
      let guess = brain.predict(inputs);

      let predicted_label = guess.indexOf(max(guess));
      let actual_label = Object.keys(data).indexOf(doodle.label);

      if (predicted_label === actual_label) {
        correct_predictions++;
      }
    }
    return correct_predictions / ((1 - divider) * Object.keys(data).length * total);
  };

  // Interface
  let trainButton = select('#train');
  let trainCounter = 0;
  trainButton.mousePressed(() => {
    trainOnDoodles();
    trainCounter++;
    console.log('Trained ' + trainCounter + ' times');
  });

  let testButton = select('#test');
  testButton.mousePressed(() => {
    let result = testIt();
    console.log('Percent: ' + nf(result, 2, 2) * 100 + '%');
  });

  let guessButton = select('#guess');
  guessButton.mousePressed(() => {
    let inputs = [];
    let img = get();
    img.resize(28, 28);
    img.loadPixels();
    for (let i = 0; i < 28 ** 2; i++) {
      let brightness = img.pixels[i * 4];
      inputs.push(brightness / 255.0);
    }
    let guess = brain.predict(inputs);
    console.log(Object.keys(data)[guess.indexOf(max(guess))]);
  });

  let clearButton = select('#clear');
  clearButton.mousePressed(() => {
    background(0);
  });
}

function draw() {
  strokeWeight(8);
  stroke(255);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}
