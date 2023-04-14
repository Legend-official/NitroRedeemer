/**
 * @Team : Coded by legions team
 * @DiscordTag : L3G3ND#2444
 * @ShopLink : DONT SKID
 * @Discripition : "To Redeem all 3 month nitro links founded in links.txt and apply them to tokens.txt using cards from cards.txt"
 */

//? importing puppetter for automating
const puppeteer = require("puppeteer");

//? defining the console log as "log"
const log = console.log;

//? importing promt package " to take input from user "
const prompt = require("prompt-sync")();

//? colors
var colors = require("colors/safe");

//? file system
const fs = require("fs");

//? Opening the files
const links = fs.readFileSync("./config/links.txt", "UTF-8"); // importing links.txt file
const links_lines = links.split(/\r?\n/); // sperating link line by line and so we can use them using [index]

const cards = fs.readFileSync("./config/cards.txt", "UTF-8"); // importing cards.txt file
const cards_lines = cards.split(/\r?\n/); // sperating card line by line and so we can use them using [index]

const tokens = fs.readFileSync("./config/tokens.txt", "UTF-8"); // importing tokens.txt file
const tokens_lines = tokens.split(/\r?\n/); // sperating token line by line and so we can use them using [index]

// const key = fs.readFileSync("./config/key.txt", "UTF-8"); // importing key.txt file
// const key_line = key.split(/\r?\n/); // sperating token line by line and so we can use them using [index]

//! ========================
//!      MAIN FUNCTION
//! ========================
async function main() {
  // changing top title bar for the progrm
  SetTerminalTitle("Discord Nitro Redeemer | Coded By: L3G3ND#6573");
  // top fency text
  await TopText();

  // check the information of file
  CheckFileInformation();

  // checking if cards are zero
  if (CheckCards(cards_lines) === 0) {
    log(
      colors.red(
        `[ERROR]: Cards File is empty please enter some cards there bro?`
      )
    );
    return;
  }

  // Taking input from user for how much cards he want to use
  const myinput = prompt(
    colors.yellow(
      `[INPUT]: How Much Cards You Want To use [ Available = ${CheckCards(
        cards_lines
      )} ]: `
    )
  );

  let input = parseInt(myinput);
  if (input === 0) {
    log(colors.red(`[ERROR]: Why u entered 0? dumbo?`));
    return;
  } else if (input <= cards_lines.length) {
    // started nitro claiming on "x" amount of tokens
    log(
      colors.blue.underline(
        `\n\t\t\t\t\t\tStarted Nitro claiming on ${tokens_lines.length} Tokens\n`
      )
    );

    // nitro claiming fucntion
    let thread = 1;
    let NitroTokensMade = {
      count: 0,
    };
    for (let cardindex = 0; cardindex < input; cardindex++) {
      for (let i = 0; i < 4; i++) {
        // re readding again all file in each loop
        const links = fs.readFileSync("./config/links.txt", "UTF-8"); // importing links.txt file
        const NitroLinks = links.split(/\r?\n/); // sperating link line by line and so we can use them using [index]

        const tokens = fs.readFileSync("./config/tokens.txt", "UTF-8"); // importing tokens.txt file
        const Tucans = tokens.split(/\r?\n/); // sperating token line by line and so we can use them using [index]

        if (CheckToken(Tucans) === 0) {
          log(colors.red(`[ERROR]: Tokens file is empty...`));
          return;
        } else if (CheckLinks(NitroLinks) === 0) {
          log(colors.red(`[ERROR]: Nitro Links file is empty...`));
          return;
        } else {
          await ClaimNitro(
            Tucans[0],
            NitroLinks[0],
            cards_lines[cardindex],
            thread,
            NitroTokensMade
          );
          thread++;
        }
      }
      DeleteCard(cards_lines[cardindex]); // this will delete the card after 6th use /shrug
    }
  } else if (input >= cards_lines.length) {
    log(
      colors.red(
        `[ERROR]: You Selected ${input} Cards but only ${cards_lines.length} available`
      )
    );
    return;
  } else {
    log(colors.red(`[ERROR]: Please Enter A Valid Number...`));
    return;
  }
}

main(); // running main funcction

//! function to set tittle of the program
function SetTerminalTitle(title) {
  process.stdout.write(
    String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7)
  );
}

//! function to login into discord
async function ClaimNitro(token, link, card, t, nitrotokensmade) {
  //showing thread started :)
  log(colors.cyan(`[ACTION][Thread#${t}]: Started...`));

  //TODO=============================================
  //TODO:        LOGIN IN INTO ACCOUNT
  //TODO=============================================

  // starting a new browser without screenshowing
  // const browser = await puppeteer.launch({
  //   executablePath: "./chrome-win/chrome.exe",
  // });

  // starting a new browser with screenshowing
  const browser = await puppeteer.launch({
    headless: false, // make it false if u want to see the web browser
    defaultViewport: false,
  });

  // const browser = await puppeteer.launch();

  //declaring discord url
  const baseURL = "https://discord.com/login";
  //starting new page
  const page = await browser.newPage();
  //attempting to open discord website
  await page
    .goto(baseURL, { waitUntil: "networkidle0", timeout: 0 })
    .catch(() => {
      log(
        colors.red(
          `[ERROR][Thread#${t}]: Discord page took so long to load! Stopped the process...`
        )
      );
      browser.close();
    });

  //script to login into discord
  //main login stuff
  try {
    await page.evaluate(async (token) => {
      function init(inputtoken) {
        //appending child
        setInterval(() => {
          let element = document.createElement("iframe");
          document.body.appendChild(
            element
          ).contentWindow.localStorage.token = `"${inputtoken}"`;
        }, 50);

        //reloading page
        setTimeout(() => {
          location.reload();
        }, 2500);
      }

      init(token);
    }, token);
  } catch (e) {
    log(e);
  }

  //reloading page
  await page.waitForTimeout(10000);
  await page.reload({ timeout: 0 });

  //* waiting 1 second
  await page.waitForNetworkIdle("networkidle0");
  await page.waitForTimeout(2000);
  let url = page.url();
  if (url == "https://discord.com/login") {
    //logging last colors.green action
    log(
      colors.red(
        `[ERROR][Thread#${t}]: Failed to logged into the account | Token Invalid`
      )
    );
    // failed to login into account so closing the browser
    await DeleteToken(token);
    await browser.close();
    return;
  } else {
    //logging last colors.green action
    log(
      colors.green(
        `[ACTION][Thread#${t}]: Logged into the account sucessfully | ${token}`
      )
    );
  }

  //TODO=============================================
  //TODO: ADDING PAYMENT METHOD TO THE ACCOUNT.
  //TODO=============================================

  let cardinfo = card.split(":");
  //* waiting 1 second
  await page.waitForNetworkIdle("networkidle0");
  await page.waitForTimeout(5000);
  // bypassing student hub tab
  try {
    let studentclose = await page.waitForXPath(
      `//button[@aria-label="Close"]`,
      { timeout: 4000 }
    );
    await studentclose.click();
  } catch (e) {
    log(colors.blue(`[BYPASSED][Thread#${t}]: BYPASSED NITRO SCREEN ...`));
  }
  //* waiting 1 second
  await page.waitForNetworkIdle("networkidle0");
  await page.waitForTimeout(2000);

  // bypassing privacy and protection tab
  try {
    let tosagree = await page.waitForXPath(`//div[contains(text(),'Agree')]`, {
      timeout: 4000,
    });
    await tosagree.click();
  } catch (e) {}
  //* waiting 1 second
  await page.waitForNetworkIdle("networkidle0");
  await page.waitForTimeout(1000);

  // clicking setting btn
  try {
    let settingbtn = await page.waitForXPath(
      `//button[@aria-label="User Settings"]`
    );
    await settingbtn.click();
  } catch (e) {
    log(colors.red(`[ERROR][Thread#${t}]: Failed to click "Settings" element`));
    browser.close();
    return;
  }
  //* waiting 1 second
  await page.waitForNetworkIdle("networkidle0");
  await page.waitForTimeout(1000);
  // clicking the billing tab
  try {
    let billingtab = await page.waitForXPath(
      `//*[@id="app-mount"]/div[2]/div[1]/div[1]/div/div[2]/div[2]/div/div[1]/div/nav/div/div[15]`
    );
    await billingtab.click();
  } catch (e) {
    log(
      colors.red(`[ERROR][Thread#${t}]: Failed to click "BillingTab" element`)
    );
    browser.close();
    return;
  }
  //* waiting 1 second
  await page.waitForNetworkIdle("networkidle0");
  await page.waitForTimeout(1000);
  // clicking add payment method
  try {
    log(
      colors.yellow(
        `[ACTION][Thread#${t}]: Attempting to add Credit card to the account`
      )
    );
    let addpayment = await page.waitForXPath(
      `//div[contains(text(),'Add Payment Method')]`
    );
    await addpayment.click();
  } catch (e) {
    log(
      colors.red(
        `[ERROR][Thread#${t}]: Failed to click "AddPaymentMethod" element`
      )
    );
    browser.close();
    return;
  }
  //* waiting 1 second
  await page.waitForNetworkIdle("networkidle0");
  await page.waitForTimeout(2000);
  // clicking card btn to add card
  try {
    let cardbtn = await page.waitForXPath(`//div[contains(text(),'Card')]`);
    await cardbtn.click();
  } catch (e) {
    log(
      colors.red(`[ERROR][Thread#${t}]: Failed to click "CardButton" element`)
    );
    browser.close();
    return;
  }
  //* waiting 1 second
  await page.waitForNetworkIdle("networkidle0");
  await page.waitForTimeout(1000);
  // adding card information
  try {
    //entering cardno
    let card_no = await page.waitForXPath(
      `//div[@data-stripe-type="cardNumber"]`
    );
    await card_no.click();
    await card_no.type(cardinfo[0], { delay: 50 });
    //entering expire date
    let card_expiredate = await page.waitForXPath(
      `//div[@data-stripe-type="cardExpiry"]`
    );
    await card_expiredate.click();
    await card_expiredate.type(cardinfo[1], { delay: 50 });
    //entering CVV
    let card_CVV = await page.waitForXPath(
      `//div[@data-stripe-type="cardCvc"]`
    );
    await card_CVV.click();
    await card_CVV.type(cardinfo[2], { delay: 50 });
    //entering the card holder name
    let card_holdername = await page.waitForXPath(
      `//input[@placeholder="Name"]`
    );
    await card_holdername.type("LegendRedeemer");
  } catch (e) {
    log(e);
    log(colors.red(`[ERROR][Thread#${t}]: Failed to fill card information`));
    browser.close();
    return;
  }
  // clicking the next button
  try {
    let next = await page.waitForXPath(`//div[contains(text(),'Next')]`);
    await next.click();
  } catch (e) {
    log(
      colors.red(
        `[ERROR][Thread#${t}]: Failed to click "Next" element after card details`
      )
    );
    browser.close();
    return;
  }
  // filling the adress details
  try {
    // filing first adress
    let address = await page.waitForXPath(
      `//input[@placeholder="123 Discord Drive"]`
    );
    await address.type(`House no 12 lmao`, { delay: 50 });
    // filling the city
    let city = await page.waitForXPath(`//input[@placeholder="Coolsville"]`);
    await city.type(`ClownHouse`, { delay: 50 });
    // filling the country
    let country = await page.waitForXPath(`//input[@name="state"]`);
    await country.type(`Punjab`, { delay: 50 });
    // filling the zipcode
    let zipcode = await page.waitForXPath(`//input[@name="postalCode"]`);
    await zipcode.type(`140301`, { delay: 50 });
  } catch (e) {
    log(colors.red(`[ERROR][Thread#${t}]: Failed to fill adress information`));
    browser.close();
    return;
  }
  // clicking the next button
  try {
    let next = await page.waitForXPath(`//div[contains(text(),'Next')]`);
    await next.click();
  } catch (e) {
    log(
      colors.red(
        `[ERROR][Thread#${t}]: Failed to click "Next" element after address details`
      )
    );
    browser.close();
    return;
  }

  //waiting to check if we get the colors.red | Duplicate payment source
  try {
    await page.waitForXPath(
      `//div[contains(text(),'Duplicate payment source')]`,
      {
        timeout: 5000,
      }
    );
    log(colors.red(`[ERROR][Thread#${t}]: Duplicate payment source occured`));
    DeleteToken(token); // delete the token
    browser.close();
    return;
  } catch (e) {}
  //waiting to check if we get the colors.red | Unable to confirm payment method
  try {
    await page.waitForXPath(
      `//div[contains(text(),'Unable to confirm payment method')]`,
      {
        timeout: 5000,
      }
    );
    log(
      colors.red(
        `[ERROR][Thread#${t}]: Unable to confirm payment method occured`
      )
    );
    browser.close();
    return;
  } catch (e) {}

  log(
    colors.green(
      `[ACTION][Thread#${t}]: Credit card added sucessfully to the account`
    )
  );

  //* waiting network to be idle
  await page.waitForTimeout(2000);

  //TODO=============================================
  //TODO:  CLAIMING THE NITRO LINK USING CARD
  //TODO=============================================

  //attempting to open nitro link
  await page.goto(link, { waitUntil: "networkidle0", timeout: 0 }).catch(() => {
    log(
      colors.red(
        `[ERROR][Thread#${t}]: Discord page took so long to load! Stopped the process...`
      )
    );
    browser.close();
  });

  log(colors.yellow(`[ACTION][Thread#${t}]: Attempting to claim nitro link`));
  await page.waitForTimeout(2000);

  // checking if user alredy have nitro claimed on there account so he cant cliam again
  try {
    await page.waitForXPath(`//h3[contains(text(),'Oh no!')]`, {
      timeout: 2000,
    });
    log(
      colors.red(
        `[ERROR][Thread#${t}]: It looks like you've had Nitro before. on the account before so you cant claim it again`
      )
    );
    DeleteToken(token); // deleting the token that alredy had nitro used so he cant claim again
    await browser.close();
    return;
  } catch (e) {}

  // checking if nitro link is alredy reddeemed
  try {
    await page.waitForXPath(
      `//div[contains(text(),'Sorry, looks like this code has already been redeemed.')]`,
      {
        timeout: 2000,
      }
    );
    log(
      colors.red(
        `[ERROR][Thread#${t}]: It looks like Nitro link is already redeemed so removing link from links.txt`
      )
    );
    DeleteLinks(link);
    DeleteToken(token);
    await browser.close();
    return;
  } catch (e) {}

  // waiting to check if we get an colors.red | This payment method cannot be used
  try {
    await page.waitForXPath(
      `//h3[contains(text(),'This payment method cannot be used')]`,
      { timeout: 2000 }
    );
    log(
      colors.red(
        `[ERROR][Thread#${t}]: Credit Card is invalid please enter a valid card in cards.txt`
      )
    );
    browser.close();
    DeleteCard(card);
    return;
  } catch (e) {}

  // clicking the next button
  try {
    let next = await page.waitForXPath(`//div[contains(text(),'Next')]`);
    await next.click();
  } catch (e) {
    log(
      colors.red(
        `[ERROR][Thread#${t}]: Failed to click "Next" element on nitro link page`
      )
    );
    browser.close();
    return;
  }
  //* waiting 1 second
  await page.waitForNetworkIdle("networkidle0");
  await page.waitForTimeout(2000);
  //clicking the checkbox at redeem page
  try {
    let checkbox = await page.waitForXPath(
      `//div[@class="checkboxLabel-3VTAjH"]`,
      {
        timeout: 4000,
      }
    );
    await checkbox.click();
  } catch (e) {
    log(
      colors.red(
        `[ERROR][Thread#${t}]: Failed to click "CheckBox" element on redeem page`
      )
    );
    browser.close();
    return;
  }
  // clicking the redeem button
  try {
    let GetNitroMonthly = await page.waitForXPath(`//button[@type="submit"]`);
    await GetNitroMonthly.click();
  } catch (e) {
    log(
      colors.red(
        `[ERROR][Thread#${t}]: Failed to click "GetNitroMonthly" element on nitro link page`
      )
    );
    browser.close();
    return;
  }

  await page.waitForNetworkIdle("networkidle0");
  await page.waitForTimeout(1000);
  // trying to reclaim if authication error comes
  try {
    await page.waitForXPath(
      `//div[contains(text(),'Authentication required')]`,
      {
        timeout: 10000,
      }
    );
    log(
      colors.red(
        `[ERROR][Thread#${t}]: Authentication required! Trying To reclaim the link using same card`
      )
    );
    //clicking the checkbox at redeem page
    try {
      let checkbox = await page.waitForXPath(
        `//div[@class="checkboxLabel-3VTAjH"]`,
        {
          timeout: 4000,
        }
      );
      await checkbox.click();
    } catch (e) {
      log(
        colors.red(
          `[ERROR][Thread#${t}]: Failed to click "CheckBox" element on redeem page`
        )
      );
      browser.close();
      return;
    }
    // clicking the redeem button
    try {
      let GetNitroMonthly = await page.waitForXPath(`//button[@type="submit"]`);
      await GetNitroMonthly.click();
    } catch (e) {
      log(
        colors.red(
          `[ERROR][Thread#${t}]: Failed to click "GetNitroMonthly" element on nitro link page`
        )
      );
      browser.close();
      return;
    }
  } catch (e) {}

  // trying to write token into the file
  await page.waitForTimeout(2000);
  // wating time after clicking submit to claim nitro
  try {
    await page.waitForXPath(
      `//div[contains(text(),'You now have superpowered perks and Server Boosts. Enjoy friend!')]`,
      {
        timeout: 30000,
      }
    );
  } catch (error) {
    console.log(error);
    log(
      colors.red(
        `[ERROR][Thread#${t}]: Failed to claim nitro due to some unkown error :3`
      )
    );
    await browser.close();
    DeleteToken(token);
    DeleteLinks(link);
    return;
  }

  try {
    // do if sucesfully
    log(
      colors.magenta(
        `[ACTION][Thread#${t}]: Sucessfully claimed nitro in token: ${token}`
      )
    );
    // adding token into nitrotoken.txt
    WriteToken(token);
    // deleting the used token from /config/token.txt file
    DeleteToken(token);
    // deleting the link used from /config/links.txt file
    DeleteLinks(link);
    // updating the tiitle baar
    nitrotokensmade.count++;
    SetTerminalTitle(
      `Discord Nitro Redeemer | Coded By: L3G3ND#6573 | NitroTokens Made: ${nitrotokensmade.count}`
    );
    // closing browser becues all done
    await page.waitForTimeout(1000);
    await browser.close();
  } catch (e) {
    // if any colors.red occured
    // log(e);
    log(
      colors.red(
        `[ERROR]: Credit Card Error! unable to claim the nitro link due to authentication`
      )
    );
  }
}

//! Writing the claimed tokens to NitroTokens.txt
function WriteToken(text) {
  fs.open("NitroTokens.txt", "a", 666, function (e, id) {
    fs.write(id, text + "\n", null, "utf8", function () {
      fs.close(id, function () {
        log(
          colors.green(`[ACTION]: Added Nitro Token In "NitroTokens.txt" File`)
        );
      });
    });
  });
}

//! Delete the tokens from orginal file so it cant be reused
function DeleteToken(token) {
  const lines = Array.from(
    fs.readFileSync("./config/tokens.txt", "utf-8").split("\n")
  ).map((link) => link.replace("\r", ""));

  let text = token; //i.e the code

  //filtering and removing that particular line
  let codes = lines.filter((code) => code !== text);
  //updating that file with left links
  fs.writeFile("./config/tokens.txt", codes.join("\n"), (err) => {
    if (err) throw err;
  });
}

//! deleting the links from orignal file so it cant be resued
function DeleteLinks(link) {
  const lines = Array.from(
    fs.readFileSync("./config/links.txt", "utf-8").split("\n")
  ).map((link) => link.replace("\r", ""));

  let text = link; //i.e the code

  //filtering and removing that particular line
  let codes = lines.filter((code) => code !== text);
  //updating that file with left links
  fs.writeFile("./config/links.txt", codes.join("\n"), (err) => {
    if (err) throw err;
  });
}

//! deleting the cards from orignal file so it cant be resued
function DeleteCard(card) {
  const lines = Array.from(
    fs.readFileSync("./config/cards.txt", "utf-8").split("\n")
  ).map((link) => link.replace("\r", ""));

  let text = card; //i.e the code

  //filtering and removing that particular line
  let codes = lines.filter((code) => code !== text);
  //updating that file with left links
  fs.writeFile("./config/cards.txt", codes.join("\n"), (err) => {
    if (err) throw err;
  });
}

//! function to display all lines count of the file
function CheckFileInformation() {
  log(colors.cyan(`[#] Total Tokens | ${CheckToken(tokens_lines)}`));
  log(colors.cyan(`[#] Total Links  | ${CheckLinks(links_lines)}`));
  log(colors.cyan(`[#] Total Cards  | ${CheckCards(cards_lines)}`));
  log("\n");
}

//! function to display top text for the program
async function TopText() {
  // clearing the console log
  console.clear();
  log("\n");

  log(
    colors.magenta(
      "██╗     ███████╗ ██████╗ ██╗ ██████╗ ███╗   ██╗    ██████╗ ███████╗██████╗ ███████╗███████╗███╗   ███╗███████╗██████╗ "
    )
  );
  log(
    colors.magenta(
      "██║     ██╔════╝██╔════╝ ██║██╔═══██╗████╗  ██║    ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝████╗ ████║██╔════╝██╔══██╗"
    )
  );
  log(
    colors.magenta(
      "██║     █████╗  ██║  ███╗██║██║   ██║██╔██╗ ██║    ██████╔╝█████╗  ██║  ██║█████╗  █████╗  ██╔████╔██║█████╗  ██████╔╝"
    )
  );
  log(
    colors.magenta(
      "██║     ██╔══╝  ██║   ██║██║██║   ██║██║╚██╗██║    ██╔══██╗██╔══╝  ██║  ██║██╔══╝  ██╔══╝  ██║╚██╔╝██║██╔══╝  ██╔══██╗"
    )
  );
  log(
    colors.magenta(
      "███████╗███████╗╚██████╔╝██║╚██████╔╝██║ ╚████║    ██║  ██║███████╗██████╔╝███████╗███████╗██║ ╚═╝ ██║███████╗██║  ██║"
    )
  );
  log(
    colors.magenta(
      "╚══════╝╚══════╝ ╚═════╝ ╚═╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝╚═════╝ ╚══════╝╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝"
    )
  );

  log("\n");

  log(colors.rainbow("\t\t\t\tMade By L3G3ND | Dont Skid Pls:3\n"));
}

//! function to calculate the lines of token.txt
function CheckToken(tokens) {
  if (tokens[0] === "") {
    return 0;
  } else {
    return tokens.length;
  }
}

//! function to calculate the lines of links.txt
function CheckLinks(links) {
  if (links[0] === "") {
    return 0;
  } else {
    return links.length;
  }
}

//! function to calculate the lines of cards.txt
function CheckCards(cards) {
  if (cards[0] === "") {
    return 0;
  } else {
    return cards.length;
  }
}

//! it is what it is lmafo
process.on("uncaughtException", function (exception) {});
process.on("unhandledRejection", (errormsgs) => {});
