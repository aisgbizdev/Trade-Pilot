// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'progression_ledger_entry.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProgressionLedgerEntry extends ProgressionLedgerEntry {
  @override
  final int id;
  @override
  final String source_;
  @override
  final int xp;
  @override
  final String dayBucket;
  @override
  final String ruleVersion;
  @override
  final DateTime createdAt;

  factory _$ProgressionLedgerEntry(
          [void Function(ProgressionLedgerEntryBuilder)? updates]) =>
      (ProgressionLedgerEntryBuilder()..update(updates))._build();

  _$ProgressionLedgerEntry._(
      {required this.id,
      required this.source_,
      required this.xp,
      required this.dayBucket,
      required this.ruleVersion,
      required this.createdAt})
      : super._();
  @override
  ProgressionLedgerEntry rebuild(
          void Function(ProgressionLedgerEntryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProgressionLedgerEntryBuilder toBuilder() =>
      ProgressionLedgerEntryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProgressionLedgerEntry &&
        id == other.id &&
        source_ == other.source_ &&
        xp == other.xp &&
        dayBucket == other.dayBucket &&
        ruleVersion == other.ruleVersion &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, source_.hashCode);
    _$hash = $jc(_$hash, xp.hashCode);
    _$hash = $jc(_$hash, dayBucket.hashCode);
    _$hash = $jc(_$hash, ruleVersion.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProgressionLedgerEntry')
          ..add('id', id)
          ..add('source_', source_)
          ..add('xp', xp)
          ..add('dayBucket', dayBucket)
          ..add('ruleVersion', ruleVersion)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class ProgressionLedgerEntryBuilder
    implements Builder<ProgressionLedgerEntry, ProgressionLedgerEntryBuilder> {
  _$ProgressionLedgerEntry? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  String? _source_;
  String? get source_ => _$this._source_;
  set source_(String? source_) => _$this._source_ = source_;

  int? _xp;
  int? get xp => _$this._xp;
  set xp(int? xp) => _$this._xp = xp;

  String? _dayBucket;
  String? get dayBucket => _$this._dayBucket;
  set dayBucket(String? dayBucket) => _$this._dayBucket = dayBucket;

  String? _ruleVersion;
  String? get ruleVersion => _$this._ruleVersion;
  set ruleVersion(String? ruleVersion) => _$this._ruleVersion = ruleVersion;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  ProgressionLedgerEntryBuilder() {
    ProgressionLedgerEntry._defaults(this);
  }

  ProgressionLedgerEntryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _source_ = $v.source_;
      _xp = $v.xp;
      _dayBucket = $v.dayBucket;
      _ruleVersion = $v.ruleVersion;
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProgressionLedgerEntry other) {
    _$v = other as _$ProgressionLedgerEntry;
  }

  @override
  void update(void Function(ProgressionLedgerEntryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProgressionLedgerEntry build() => _build();

  _$ProgressionLedgerEntry _build() {
    final _$result = _$v ??
        _$ProgressionLedgerEntry._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'ProgressionLedgerEntry', 'id'),
          source_: BuiltValueNullFieldError.checkNotNull(
              source_, r'ProgressionLedgerEntry', 'source_'),
          xp: BuiltValueNullFieldError.checkNotNull(
              xp, r'ProgressionLedgerEntry', 'xp'),
          dayBucket: BuiltValueNullFieldError.checkNotNull(
              dayBucket, r'ProgressionLedgerEntry', 'dayBucket'),
          ruleVersion: BuiltValueNullFieldError.checkNotNull(
              ruleVersion, r'ProgressionLedgerEntry', 'ruleVersion'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'ProgressionLedgerEntry', 'createdAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
