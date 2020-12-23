import { Authorizer } from '../../app/Authorization/Authorizer'
import { SessionTokenDBAccess } from '../../app/Authorization/SessionTokenDBAccess'
import { UserCredentialsDbAccess } from '../../app/Authorization/UserCredentialsDbAccess'
import { Account, SessionToken, TokenState } from '../../app/Models/ServerModels'
jest.mock('../../app/Authorization/SessionTokenDBAccess')
jest.mock('../../app/Authorization/UserCredentialsDbAccess')

describe('Authorizer test suite', () => {
  let authorizer: Authorizer

  const sessionTokenDBAccessMock = {
    storeSessionToken: jest.fn()
  }
  const userCredentialsDBAccessMock = {
    getUserCredential: jest.fn()
  }

  beforeEach(() => {
    authorizer = new Authorizer(
      sessionTokenDBAccessMock as any,
      userCredentialsDBAccessMock as any
    )
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('constructor no arguments', () => {
    new Authorizer();
    expect(SessionTokenDBAccess).toBeCalled()
    expect(UserCredentialsDbAccess).toBeCalled()
  })

  const someAccount: Account = {
    username: 'someUser',
    password: 'somePassword'
  }

  test('should return null if invalid credentials', async () => {
    userCredentialsDBAccessMock.getUserCredential.mockReturnValue(null);
    const loginResult = await authorizer.generateToken(someAccount);
    expect(loginResult).toBeNull;
    expect(userCredentialsDBAccessMock.getUserCredential).
        toBeCalledWith(someAccount.username, someAccount.password);
  });

  test('should return sessionToken for valid credentials', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValueOnce(0)
    jest.spyOn(global.Date, 'now').mockReturnValueOnce(0)
    userCredentialsDBAccessMock.getUserCredential.mockReturnValue({
      username: 'someUser',
      password: 'somePassword',
      accessRights: [1, 2, 3]
    })
    const expectedSessionToken: SessionToken = {
      userName: 'someUser',
      accessRights: [1, 2, 3],
      valid: true,
      tokenId: '',
      expirationTime: new Date(60 * 60 * 1000)
    }
    const sessionToken = await authorizer.generateToken(someAccount)
    expect(expectedSessionToken).toEqual(sessionToken)
    expect(sessionTokenDBAccessMock.storeSessionToken).toBeCalledWith(sessionToken)
  })
})