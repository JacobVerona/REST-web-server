export class TestController {
    tokenPing = {
        validation: [],
        handler: async (req, res) => {
            res.status(200).send('SUCCESS ACCESS!')
        }
    }
}

const testController = new TestController()
export { testController }