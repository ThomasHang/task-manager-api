import { db } from '../db.js';

const tasks = db.data.tasks;

export async function getTasks(req, res) {
  const userTasks = tasks.filter(t => t.userId === req.user.userId);
  res.json(userTasks);
}

export async function createTask(req, res) {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: '任务标题不能为空' });

  const newTask = { id: Date.now(), title, completed: false, userId: req.user.userId };
  tasks.push(newTask);
  await db.write();
  res.status(201).json(newTask);
}

export async function getTaskById(req, res) {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: '任务不存在' });
  res.json(task);
}

export async function updateTask(req, res) {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: '任务不存在' });

  const { title, completed } = req.body;
  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;
  await db.write();
  res.json(task);
}

export async function deleteTask(req, res) {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: '任务不存在' });

  const deleted = tasks.splice(index, 1)[0];
  await db.write();
  res.json({ message: '任务已删除', deleted });
}
