// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'instrument_request_rank.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$InstrumentRequestRank extends InstrumentRequestRank {
  @override
  final String code;
  @override
  final int interestedUsers;
  @override
  final DateTime lastRequestedAt;

  factory _$InstrumentRequestRank(
          [void Function(InstrumentRequestRankBuilder)? updates]) =>
      (InstrumentRequestRankBuilder()..update(updates))._build();

  _$InstrumentRequestRank._(
      {required this.code,
      required this.interestedUsers,
      required this.lastRequestedAt})
      : super._();
  @override
  InstrumentRequestRank rebuild(
          void Function(InstrumentRequestRankBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  InstrumentRequestRankBuilder toBuilder() =>
      InstrumentRequestRankBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is InstrumentRequestRank &&
        code == other.code &&
        interestedUsers == other.interestedUsers &&
        lastRequestedAt == other.lastRequestedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, code.hashCode);
    _$hash = $jc(_$hash, interestedUsers.hashCode);
    _$hash = $jc(_$hash, lastRequestedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'InstrumentRequestRank')
          ..add('code', code)
          ..add('interestedUsers', interestedUsers)
          ..add('lastRequestedAt', lastRequestedAt))
        .toString();
  }
}

class InstrumentRequestRankBuilder
    implements Builder<InstrumentRequestRank, InstrumentRequestRankBuilder> {
  _$InstrumentRequestRank? _$v;

  String? _code;
  String? get code => _$this._code;
  set code(String? code) => _$this._code = code;

  int? _interestedUsers;
  int? get interestedUsers => _$this._interestedUsers;
  set interestedUsers(int? interestedUsers) =>
      _$this._interestedUsers = interestedUsers;

  DateTime? _lastRequestedAt;
  DateTime? get lastRequestedAt => _$this._lastRequestedAt;
  set lastRequestedAt(DateTime? lastRequestedAt) =>
      _$this._lastRequestedAt = lastRequestedAt;

  InstrumentRequestRankBuilder() {
    InstrumentRequestRank._defaults(this);
  }

  InstrumentRequestRankBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _code = $v.code;
      _interestedUsers = $v.interestedUsers;
      _lastRequestedAt = $v.lastRequestedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(InstrumentRequestRank other) {
    _$v = other as _$InstrumentRequestRank;
  }

  @override
  void update(void Function(InstrumentRequestRankBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  InstrumentRequestRank build() => _build();

  _$InstrumentRequestRank _build() {
    final _$result = _$v ??
        _$InstrumentRequestRank._(
          code: BuiltValueNullFieldError.checkNotNull(
              code, r'InstrumentRequestRank', 'code'),
          interestedUsers: BuiltValueNullFieldError.checkNotNull(
              interestedUsers, r'InstrumentRequestRank', 'interestedUsers'),
          lastRequestedAt: BuiltValueNullFieldError.checkNotNull(
              lastRequestedAt, r'InstrumentRequestRank', 'lastRequestedAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
