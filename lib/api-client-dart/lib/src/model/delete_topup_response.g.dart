// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_topup_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DeleteTopupResponse extends DeleteTopupResponse {
  @override
  final int id;
  @override
  final int creditsReversed;
  @override
  final int creditBalance;

  factory _$DeleteTopupResponse(
          [void Function(DeleteTopupResponseBuilder)? updates]) =>
      (DeleteTopupResponseBuilder()..update(updates))._build();

  _$DeleteTopupResponse._(
      {required this.id,
      required this.creditsReversed,
      required this.creditBalance})
      : super._();
  @override
  DeleteTopupResponse rebuild(
          void Function(DeleteTopupResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DeleteTopupResponseBuilder toBuilder() =>
      DeleteTopupResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DeleteTopupResponse &&
        id == other.id &&
        creditsReversed == other.creditsReversed &&
        creditBalance == other.creditBalance;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, creditsReversed.hashCode);
    _$hash = $jc(_$hash, creditBalance.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DeleteTopupResponse')
          ..add('id', id)
          ..add('creditsReversed', creditsReversed)
          ..add('creditBalance', creditBalance))
        .toString();
  }
}

class DeleteTopupResponseBuilder
    implements Builder<DeleteTopupResponse, DeleteTopupResponseBuilder> {
  _$DeleteTopupResponse? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  int? _creditsReversed;
  int? get creditsReversed => _$this._creditsReversed;
  set creditsReversed(int? creditsReversed) =>
      _$this._creditsReversed = creditsReversed;

  int? _creditBalance;
  int? get creditBalance => _$this._creditBalance;
  set creditBalance(int? creditBalance) =>
      _$this._creditBalance = creditBalance;

  DeleteTopupResponseBuilder() {
    DeleteTopupResponse._defaults(this);
  }

  DeleteTopupResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _creditsReversed = $v.creditsReversed;
      _creditBalance = $v.creditBalance;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DeleteTopupResponse other) {
    _$v = other as _$DeleteTopupResponse;
  }

  @override
  void update(void Function(DeleteTopupResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DeleteTopupResponse build() => _build();

  _$DeleteTopupResponse _build() {
    final _$result = _$v ??
        _$DeleteTopupResponse._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'DeleteTopupResponse', 'id'),
          creditsReversed: BuiltValueNullFieldError.checkNotNull(
              creditsReversed, r'DeleteTopupResponse', 'creditsReversed'),
          creditBalance: BuiltValueNullFieldError.checkNotNull(
              creditBalance, r'DeleteTopupResponse', 'creditBalance'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
