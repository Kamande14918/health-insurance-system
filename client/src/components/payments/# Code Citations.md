# Code Citations

## License: CC0_1_0
https://github.com/hoangsonww/Community-Sphere-Social-Media/tree/1e1ae251a15a469481b0621379d03f8035fa2833/server.js

```
(req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err
```


## License: unknown
https://github.com/Ytiwari24/ahir_seva/tree/5c130ce6fe592a673f4b7b4e5d9837144b9b8edf/app.js

```
/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) =>
```


## License: MIT
https://github.com/LabContainer/LabContainer/tree/81eb61c2f0528daf9b31ebac453dddd489894cba/client/src/pages/passwordReset/passReset.tsx

```
> {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const
```


## License: unknown
https://github.com/sa4084/Kirana-Frontend/tree/dbb49badd8e96711038392d5779b596ae4891e85/src/components/AuthPage.js

```
] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) =
```


## License: unknown
https://github.com/staystrongbg/devoxBlog/tree/72eaafad0374819f43bbbfd38db76a74db6af037/src/pages/Register.jsx

```
password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
```

