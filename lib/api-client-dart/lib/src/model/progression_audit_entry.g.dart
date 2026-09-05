// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'progression_audit_entry.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProgressionAuditEntry extends ProgressionAuditEntry {
  @override
  final int id;
  @override
  final int userId;
  @override
  final String source_;
  @override
  final String sourceEventId;
  @override
  final int xp;
  @override
  final String dayBucket;
  @override
  final String ruleVersion;
  @override
  final BuiltMap<String, JsonObject?> metadata;
  @override
  final DateTime createdAt;

  factory _$ProgressionAuditEntry(
          [void Function(ProgressionAuditEntryBuilder)? updates]) =>
      (ProgressionAuditEntryBuilder()..update(updates))._build();

  _$ProgressionAuditEntry._(
      {required this.id,
      required this.userId,
      required this.source_,
      required this.sourceEventId,
      required this.xp,
      required this.dayBucket,
      required this.ruleVersion,
      required this.metadata,
      required this.createdAt})
      : super._();
  @override
  ProgressionAuditEntry rebuild(
          void Function(ProgressionAuditEntryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProgressionAuditEntryBuilder toBuilder() =>
      ProgressionAuditEntryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProgressionAuditEntry &&
        id == other.id &&
        userId == other.userId &&
        source_ == other.source_ &&
        sourceEventId == other.sourceEventId &&
        xp == other.xp &&
        dayBucket == other.dayBucket &&
        ruleVersion == other.ruleVersion &&
        metadata == other.metadata &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, userId.hashCode);
    _$hash = $jc(_$hash, source_.hashCode);
    _$hash = $jc(_$hash, sourceEventId.hashCode);
    _$hash = $jc(_$hash, xp.hashCode);
    _$hash = $jc(_$hash, dayBucket.hashCode);
    _$hash = $jc(_$hash, ruleVersion.hashCode);
    _$hash = $jc(_$hash, metadata.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProgressionAuditEntry')
          ..add('id', id)
          ..add('userId', userId)
          ..add('source_', source_)
          ..add('sourceEventId', sourceEventId)
          ..add('xp', xp)
          ..add('dayBucket', dayBucket)
          ..add('ruleVersion', ruleVersion)
          ..add('metadata', metadata)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class ProgressionAuditEntryBuilder
    implements Builder<ProgressionAuditEntry, ProgressionAuditEntryBuilder> {
  _$ProgressionAuditEntry? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  int? _userId;
  int? get userId => _$this._userId;
  set userId(int? userId) => _$this._userId = userId;

  String? _source_;
  String? get source_ => _$this._source_;
  set source_(String? source_) => _$this._source_ = source_;

  String? _sourceEventId;
  String? get sourceEventId => _$this._sourceEventId;
  set sourceEventId(String? sourceEventId) =>
      _$this._sourceEventId = sourceEventId;

  int? _xp;
  int? get xp => _$this._xp;
  set xp(int? xp) => _$this._xp = xp;

  String? _dayBucket;
  String? get dayBucket => _$this._dayBucket;
  set dayBucket(String? dayBucket) => _$this._dayBucket = dayBucket;

  String? _ruleVersion;
  String? get ruleVersion => _$this._ruleVersion;
  set ruleVersion(String? ruleVersion) => _$this._ruleVersion = ruleVersion;

  MapBuilder<String, JsonObject?>? _metadata;
  MapBuilder<String, JsonObject?> get metadata =>
      _$this._metadata ??= MapBuilder<String, JsonObject?>();
  set metadata(MapBuilder<String, JsonObject?>? metadata) =>
      _$this._metadata = metadata;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  ProgressionAuditEntryBuilder() {
    ProgressionAuditEntry._defaults(this);
  }

  ProgressionAuditEntryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _userId = $v.userId;
      _source_ = $v.source_;
      _sourceEventId = $v.sourceEventId;
      _xp = $v.xp;
      _dayBucket = $v.dayBucket;
      _ruleVersion = $v.ruleVersion;
      _metadata = $v.metadata.toBuilder();
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProgressionAuditEntry other) {
    _$v = other as _$ProgressionAuditEntry;
  }

  @override
  void update(void Function(ProgressionAuditEntryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProgressionAuditEntry build() => _build();

  _$ProgressionAuditEntry _build() {
    _$ProgressionAuditEntry _$result;
    try {
      _$result = _$v ??
          _$ProgressionAuditEntry._(
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'ProgressionAuditEntry', 'id'),
            userId: BuiltValueNullFieldError.checkNotNull(
                userId, r'ProgressionAuditEntry', 'userId'),
            source_: BuiltValueNullFieldError.checkNotNull(
                source_, r'ProgressionAuditEntry', 'source_'),
            sourceEventId: BuiltValueNullFieldError.checkNotNull(
                sourceEventId, r'ProgressionAuditEntry', 'sourceEventId'),
            xp: BuiltValueNullFieldError.checkNotNull(
                xp, r'ProgressionAuditEntry', 'xp'),
            dayBucket: BuiltValueNullFieldError.checkNotNull(
                dayBucket, r'ProgressionAuditEntry', 'dayBucket'),
            ruleVersion: BuiltValueNullFieldError.checkNotNull(
                ruleVersion, r'ProgressionAuditEntry', 'ruleVersion'),
            metadata: metadata.build(),
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'ProgressionAuditEntry', 'createdAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'metadata';
        metadata.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProgressionAuditEntry', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
