import React, { useState, useEffect } from 'react';
import { X, Calendar, BookOpen, AlertCircle, Layers } from 'lucide-react';

const PRESET_SUBJECTS = [
  'React.js',
  'JavaScript',
  'Data Analytics',
  'Computer Networks',
  'Machine Learning',
  'Operating Systems'
];

const AssignmentForm = ({
  isOpen,
  initialData = null,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');

      const isPreset = PRESET_SUBJECTS.includes(initialData.subject);
      if (isPreset) {
        setSubject(initialData.subject);
        setIsCustomSubject(false);
        setCustomSubject('');
      } else {
        setSubject('Other');
        setIsCustomSubject(true);
        setCustomSubject(initialData.subject || '');
      }

      setDescription(initialData.description || '');

      // Format dueDate to YYYY-MM-DD for <input type="date" />
      if (initialData.dueDate) {
        const d = new Date(initialData.dueDate);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setDueDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setDueDate('');
      }

      setPriority(initialData.priority || 'Medium');
      setStatus(initialData.status || 'Pending');
    } else {
      // Defaults for new assignment
      setTitle('');
      setSubject('React.js');
      setIsCustomSubject(false);
      setCustomSubject('');
      setDescription('');
      
      // Default due date to 3 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      const yyyy = defaultDate.getFullYear();
      const mm = String(defaultDate.getMonth() + 1).padStart(2, '0');
      const dd = String(defaultDate.getDate()).padStart(2, '0');
      setDueDate(`${yyyy}-${mm}-${dd}`);

      setPriority('Medium');
      setStatus('Pending');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubjectSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'Other') {
      setIsCustomSubject(true);
      setSubject('Other');
    } else {
      setIsCustomSubject(false);
      setSubject(val);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Assignment title is required';
    } else if (title.trim().length > 120) {
      newErrors.title = 'Title cannot exceed 120 characters';
    }

    const finalSubject = isCustomSubject ? customSubject.trim() : subject;
    if (!finalSubject) {
      newErrors.subject = 'Subject name is required';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalSubject = isCustomSubject ? customSubject.trim() : subject;

    const payload = {
      title: title.trim(),
      subject: finalSubject,
      description: description.trim(),
      dueDate,
      priority,
      status
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--primary-600)" />
            <h2 className="modal-title">
              {initialData ? 'Edit Assignment' : 'Create New Assignment'}
            </h2>
          </div>
          <button className="btn-icon" onClick={onCancel} disabled={loading}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Assignment Title *
              </label>
              <input
                id="title"
                type="text"
                className="form-control"
                placeholder="e.g. Build an Interactive Dashboard with React Hooks"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            {/* Subject Selector & Custom Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="subjectSelect">
                Subject Name *
              </label>
              <select
                id="subjectSelect"
                className="form-control"
                value={isCustomSubject ? 'Other' : subject}
                onChange={handleSubjectSelectChange}
              >
                {PRESET_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
                <option value="Other">+ Custom Subject...</option>
              </select>

              {isCustomSubject && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter custom subject name (e.g. Artificial Intelligence)"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                  />
                </div>
              )}
              {errors.subject && <span className="form-error">{errors.subject}</span>}
            </div>

            {/* Due Date & Priority Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '16px'
              }}
            >
              <div className="form-group">
                <label className="form-label" htmlFor="dueDate">
                  Due Date *
                </label>
                <input
                  id="dueDate"
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                {errors.dueDate && (
                  <span className="form-error">{errors.dueDate}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="priority">
                  Priority Level
                </label>
                <select
                  id="priority"
                  className="form-control"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="High">🔴 High Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="Low">🔵 Low Priority</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="status">
                  Initial Status
                </label>
                <select
                  id="status"
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">⏳ Pending</option>
                  <option value="In Progress">⚡ In Progress</option>
                  <option value="Completed">✅ Completed</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="description">
                Description / Notes (Optional)
              </label>
              <textarea
                id="description"
                className="form-control"
                placeholder="Include instructions, submission criteria, or reference links..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : initialData
                ? 'Update Assignment'
                : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;

