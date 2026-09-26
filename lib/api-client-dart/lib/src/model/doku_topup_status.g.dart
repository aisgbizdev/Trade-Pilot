// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'doku_topup_status.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DokuTopupStatus extends DokuTopupStatus {
  @override
  final int id;
  @override
  final TopupRequestStatus status;

  factory _$DokuTopupStatus([void Function(DokuTopupStatusBuilder)? updates]) =>
      (DokuTopupStatusBuilder()..update(updates))._build();

  _$DokuTopupStatus._({required this.id, required this.status}) : super._();
  @override
  DokuTopupStatus rebuild(void Function(DokuTopupStatusBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DokuTopupStatusBuilder toBuilder() => DokuTopupStatusBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DokuTopupStatus && id == other.id && status == other.status;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, status.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DokuTopupStatus')
          ..add('id', id)
          ..add('status', status))
        .toString();
  }
}

class DokuTopupStatusBuilder
    implements Builder<DokuTopupStatus, DokuTopupStatusBuilder> {
  _$DokuTopupStatus? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  TopupRequestStatus? _status;
  TopupRequestStatus? get status => _$this._status;
  set status(TopupRequestStatus? status) => _$this._status = status;

  DokuTopupStatusBuilder() {
    DokuTopupStatus._defaults(this);
  }

  DokuTopupStatusBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _status = $v.status;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DokuTopupStatus other) {
    _$v = other as _$DokuTopupStatus;
  }

  @override
  void update(void Function(DokuTopupStatusBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DokuTopupStatus build() => _build();

  _$DokuTopupStatus _build() {
    final _$result = _$v ??
        _$DokuTopupStatus._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'DokuTopupStatus', 'id'),
          status: BuiltValueNullFieldError.checkNotNull(
              status, r'DokuTopupStatus', 'status'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
