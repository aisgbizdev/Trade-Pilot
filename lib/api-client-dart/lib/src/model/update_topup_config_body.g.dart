// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_topup_config_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateTopupConfigBody extends UpdateTopupConfigBody {
  @override
  final int rupiahPerCredit;

  factory _$UpdateTopupConfigBody(
          [void Function(UpdateTopupConfigBodyBuilder)? updates]) =>
      (UpdateTopupConfigBodyBuilder()..update(updates))._build();

  _$UpdateTopupConfigBody._({required this.rupiahPerCredit}) : super._();
  @override
  UpdateTopupConfigBody rebuild(
          void Function(UpdateTopupConfigBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateTopupConfigBodyBuilder toBuilder() =>
      UpdateTopupConfigBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateTopupConfigBody &&
        rupiahPerCredit == other.rupiahPerCredit;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, rupiahPerCredit.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateTopupConfigBody')
          ..add('rupiahPerCredit', rupiahPerCredit))
        .toString();
  }
}

class UpdateTopupConfigBodyBuilder
    implements Builder<UpdateTopupConfigBody, UpdateTopupConfigBodyBuilder> {
  _$UpdateTopupConfigBody? _$v;

  int? _rupiahPerCredit;
  int? get rupiahPerCredit => _$this._rupiahPerCredit;
  set rupiahPerCredit(int? rupiahPerCredit) =>
      _$this._rupiahPerCredit = rupiahPerCredit;

  UpdateTopupConfigBodyBuilder() {
    UpdateTopupConfigBody._defaults(this);
  }

  UpdateTopupConfigBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _rupiahPerCredit = $v.rupiahPerCredit;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateTopupConfigBody other) {
    _$v = other as _$UpdateTopupConfigBody;
  }

  @override
  void update(void Function(UpdateTopupConfigBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateTopupConfigBody build() => _build();

  _$UpdateTopupConfigBody _build() {
    final _$result = _$v ??
        _$UpdateTopupConfigBody._(
          rupiahPerCredit: BuiltValueNullFieldError.checkNotNull(
              rupiahPerCredit, r'UpdateTopupConfigBody', 'rupiahPerCredit'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
