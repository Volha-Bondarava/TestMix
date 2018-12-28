require('colors')
let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()
let wd = require('wd')
let serverConfig = require('../helpers/appium').local
let desiredCaps = require('../helpers/caps').capabilities
let credentials = require('../helpers/credentials')

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness

let driver = wd.promiseChainRemote(serverConfig)

driver.on('status', (info) => {
    console.log(info.cyan)
  }
)
driver.on('command', (eventType, command, response) => {
    console.log(' > ' + eventType.cyan, command, (response || '').grey)
  }
)
driver.on('http', (meth, path, data) => {
    console.log(' > ' + meth.magenta, path, (data || '').grey)
  }
)

driver
  .sleep(10000)
  .init(desiredCaps)
  .elementByXPath('//android.widget.ScrollView/android.widget.LinearLayout/android.widget.TextView')
  .text()
  .then((title) => {
    title.should.equal('my shows', `title should be 'my shows'`)
  })
  .elementById('ru.myshows.activity:id/login_field')
  .type(credentials.login)
  .elementById('ru.myshows.activity:id/password_field')
  .type(credentials.pass)
  .elementById('ru.myshows.activity:id/login_button')
  .click()
  .elementOrNull('accessibility id', 'Open navigation drawer')
  .then((element) => {
    element.should.not.equal(null, 'navigation drawer button should appear after successful sign in')
  })
  .fin(() => {
    return driver.quit()
  })
  .done()