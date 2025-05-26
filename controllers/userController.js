import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const users = db.data.users;
const SECRET_KEY = 'tianhang-secret-key';

export async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: '用户名和密码不能为空' });

  const exists = users.some(u => u.username === username);
  if (exists) return res.status(409).json({ error: '用户名已存在' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = { id: Date.now(), username, password: hashedPassword };
  users.push(newUser);
  await db.write();
  res.status(201).json({ message: '注册成功', user: { id: newUser.id, username } });
}

export async function login(req, res) {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  const token = jwt.sign({ userId: user.id, username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: '登录成功', token });
}
