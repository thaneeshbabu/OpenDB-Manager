import { useEffect, useState } from "react";
import { getRecords, createRecord, updateRecord, deleteRecord } from "../services/recordService";
import { 
  FiSearch, FiEdit, FiTrash2, FiPlus, 
  FiFolder, FiDatabase, FiFileText, FiClock, FiCheckCircle 
} from "react-icons/fi";
import "./Records.css";

function Records() {

    const storedUser = JSON.parse(localStorage.getItem("user"));
const role = storedUser?.role;

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Custom Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [editId, setEditId] = useState(null);

  // Custom Modal State
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    id: null
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await getRecords();
      setRecords(data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load records");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateRecord(editId, formData);
        setEditId(null);
      } else {
        await createRecord(formData);
      }
      setFormData({ title: "", description: "", category: "" });
      setShowForm(false);
      loadRecords();
    } catch (error) {
      console.error(error);
      alert("Operation Failed");
    }
  };

  const editRecord = (record) => {
    setEditId(record.id);
    setFormData({
      title: record.title,
      description: record.description,
      category: record.category,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const triggerDeleteConfirm = (id) => {
    setDeleteModal({ show: true, id });
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(deleteModal.id);
      setDeleteModal({ show: false, id: null });
      loadRecords();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Filter and Pagination Computations
  const filteredRecords = records.filter((record) =>
    record.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const displayedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Computed Metrics for KPI Cards
  const totalRecordsCount = records.length;
  const totalCategoriesCount = new Set(records.map(r => r.category).filter(Boolean)).size;
  const activeRecordsCount = records.filter(r => r.title && r.description).length; // Simulated lifecycle calculation

  return (
    <div className="dashboard-container">
      {/* Header View */}
      <header className="dashboard-header">
        <div className="header-titles">
          <h1>📄 Records Management</h1>
          <p>Manage, search, update and organize database records efficiently.</p>
        </div>
        {role !== "Viewer" && (
<button
  className="btn-add-toggle"
  onClick={() => {
    setShowForm(!showForm);

    if (editId) {
      setEditId(null);
      setFormData({
        title: "",
        description: "",
        category: "",
      });
    }
  }}
>
  {showForm ? "✖ Close Form" : "➕ Add New Record"}
</button>
        )}
      </header>

      {/* Statistics Cards */}
      <section className="metrics-grid">
        <div className="metric-card metric-blue">
          <div className="metric-info">
            <span className="metric-label">Total Records</span>
            <h3 className="metric-value">{totalRecordsCount}</h3>
          </div>
          <FiDatabase className="metric-icon" />
        </div>
        <div className="metric-card metric-purple">
          <div className="metric-info">
            <span className="metric-label">Categories</span>
            <h3 className="metric-value">{totalCategoriesCount}</h3>
          </div>
          <FiFolder className="metric-icon" />
        </div>
        <div className="metric-card metric-green">
          <div className="metric-info">
            <span className="metric-label">Active Records</span>
            <h3 className="metric-value">{activeRecordsCount}</h3>
          </div>
          <FiCheckCircle className="metric-icon" />
        </div>
        <div className="metric-card metric-orange">
          <div className="metric-info">
            <span className="metric-label">Last Updated</span>
            <h3 className="metric-value">Just Now</h3>
          </div>
          <FiClock className="metric-icon" />
        </div>
      </section>

      {/* Dynamic Slide-down Add/Edit Card Panel */}
      {role !== "Viewer" && showForm && (
        <div className="form-card-wrapper">
          <div className="form-card">
            <h3>{editId ? "⚡ Update Selected Record" : "✨ Create New Entry Record"}</h3>
            <form onSubmit={handleSubmit} className="responsive-form-grid">
              
              <div className="input-group">
                <input 
                  type="text" 
                  name="title" 
                  required
                  placeholder=" " 
                  value={formData.title} 
                  onChange={handleChange} 
                />
                <label><FiFileText className="inline-icon" /> Title</label>
              </div>

              <div className="input-group">
                <input 
                  type="text" 
                  name="category" 
                  required
                  placeholder=" " 
                  value={formData.category} 
                  onChange={handleChange} 
                />
                <label><FiFolder className="inline-icon" /> Category</label>
              </div>

              <div className="input-group full-width">
                <input 
                  type="text" 
                  name="description" 
                  required
                  placeholder=" " 
                  value={formData.description} 
                  onChange={handleChange} 
                />
                <label><FiFileText className="inline-icon" /> Description</label>
              </div>

              <div className="form-actions full-width">
                <button type="submit" className="btn-submit">
                  {editId ? "Update Record" : "Add Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table Workspace Controls */}
      <div className="workspace-card">
        <div className="search-toolbar">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search records by title..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="premium-search-input"
            />
          </div>
        </div>

        {/* Data Container Render */}
        {displayedRecords.length === 0 ? (
          <div className="empty-state-view">
            <div className="illustration-avatar">🔍</div>
            <h2>No Records Found</h2>
            <p>We couldn't find any data rows matching your active parameters or keyword criteria.</p>
            <button className="btn-cta" onClick={() => { setShowForm(true); setEditId(null); setFormData({title:"", description:"", category:""}); }}>
              Create First Record
            </button>
          </div>
        ) : (
          <>
            <div className="table-responsive-wrapper">
              <table className="premium-data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Created Date</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRecords.map((record) => (
                    <tr key={record.id}>
                      <td><span className="badge-id"># {record.id}</span></td>
                      <td className="text-strong">{record.title}</td>
                      <td className="text-muted">{record.description}</td>
                      <td><span className="badge-category">{record.category || "General"}</span></td>
                      <td className="text-small">July 12, 2026</td>
                      <td>
                        <div className="action-button-cell">
                         {role !== "Viewer" && (
<button
 className="btn-action btn-edit"
 title="Edit Record"
 onClick={() => editRecord(record)}
>
    </button>
    )}
                            <FiEdit />
                       
                          {role === "Admin" && (
<button
 className="btn-action btn-delete"
 title="Delete Record"
 onClick={() => triggerDeleteConfirm(record.id)}
>
    </button>
                          )}
                            <FiTrash2 />
                         
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            {totalPages > 1 && (
              <div className="table-pagination-footer">
                <span className="pagination-info">
                  Showing page <b>{currentPage}</b> of {totalPages} ({filteredRecords.length} entries)
                </span>
                <div className="pagination-buttons">
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`pagination-btn ${currentPage === idx + 1 ? "active" : ""}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Overlay Modal */}
      {deleteModal.show && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-icon-header">⚠️</div>
            <h2>Delete Record?</h2>
            <p>This action cannot be undone. All database associations with this entity will be permanently severed.</p>
            <div className="modal-footer-actions">
              <button className="btn-modal-cancel" onClick={() => setDeleteModal({ show: false, id: null })}>
                Cancel
              </button>
              <button className="btn-modal-confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Records;