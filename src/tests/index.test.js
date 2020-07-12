const app = require('../server/index')
const supertest = require('supertest')
const request = supertest(app)

describe('Server endpoint', () => {
    it('gets the test endpoint', async done => {
        const res = await request.get('/test')
          expect(res.status).toBe(200)
          expect(res.body.message).toBe('pass!')
          done()
    })
    it('gets data for austin, texas', async done => {
      let dt = new Date().toISOString().split('T')[0];
        await supertest(app)
            .get('/forecast')
            .query({
                loc: "austin",
                date: dt
            })
            .expect(200)
            .then(response => console.log(response.body))
            done()
    });
})
