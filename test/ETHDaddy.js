const { getDefaultNormalizer } = require("@testing-library/react");
const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("ETHDaddy", () => {
  let ethDaddy;

  const NAME = "ETH Daddy"
  const SYMBOL = "ETHD"

  let deployer, owner1

  beforeEach(async () => {

    [deployer, owner1] = await ethers.getSigners();

    const ETHDADDY = await ethers.getContractFactory("ETHDaddy")
    ethDaddy = await ETHDADDY.deploy("ETH Daddy", "ETHD")

    const list = await ethDaddy.connect(deployer).listDomain("yash.eth", tokens(1))
    await list.wait()
  })

  describe("deployment", () => {

    it("has a name", async () => {
      let result = await ethDaddy.name()
      expect(result).to.equal(NAME)
    })

    it("has a symbol", async () => {
      let result = await ethDaddy.symbol()
      expect(result).to.equal(SYMBOL)
    })

    it("has a owner", async () => {
      const result = await ethDaddy.owner()
      expect(result).to.equal(deployer.address)
    })
  })

  describe("list", () => {
    it("has a domain name", async () => {
      const result = await ethDaddy.getDomain(1)
      expect(result.name).to.equal("yash.eth")
    })
  })

  describe("Minting", () => {
    const ID = 1
    const AMOUNT = tokens(1)

    beforeEach(async () => {
      const transaction = await ethDaddy.connect(owner1).mint(ID, { value: AMOUNT })
      await transaction.wait()
    })

    it("it updates the owner", async () => {
      const result = await ethDaddy.ownerOf(ID)
      expect(result).to.equal(owner1.address)
    })

    it('Updates the domain status', async () => {
      const result = await ethDaddy.getDomain(ID)
      expect(result.isOwned).to.equal(true)
    })

    it("it update the contract balance", async () => {
      const result = await ethDaddy.getBalance()
      expect(result).to.equal(AMOUNT)
    })
  })
})
