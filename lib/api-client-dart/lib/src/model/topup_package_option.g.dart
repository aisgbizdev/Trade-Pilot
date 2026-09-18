// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_package_option.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TopupPackageOption extends TopupPackageOption {
  @override
  final int amountRupiah;
  @override
  final int credits;

  factory _$TopupPackageOption(
          [void Function(TopupPackageOptionBuilder)? updates]) =>
      (TopupPackageOptionBuilder()..update(updates))._build();

  _$TopupPackageOption._({required this.amountRupiah, required this.credits})
      : super._();
  @override
  TopupPackageOption rebuild(
          void Function(TopupPackageOptionBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TopupPackageOptionBuilder toBuilder() =>
      TopupPackageOptionBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TopupPackageOption &&
        amountRupiah == other.amountRupiah &&
        credits == other.credits;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, amountRupiah.hashCode);
    _$hash = $jc(_$hash, credits.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TopupPackageOption')
          ..add('amountRupiah', amountRupiah)
          ..add('credits', credits))
        .toString();
  }
}

class TopupPackageOptionBuilder
    implements Builder<TopupPackageOption, TopupPackageOptionBuilder> {
  _$TopupPackageOption? _$v;

  int? _amountRupiah;
  int? get amountRupiah => _$this._amountRupiah;
  set amountRupiah(int? amountRupiah) => _$this._amountRupiah = amountRupiah;

  int? _credits;
  int? get credits => _$this._credits;
  set credits(int? credits) => _$this._credits = credits;

  TopupPackageOptionBuilder() {
    TopupPackageOption._defaults(this);
  }

  TopupPackageOptionBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _amountRupiah = $v.amountRupiah;
      _credits = $v.credits;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TopupPackageOption other) {
    _$v = other as _$TopupPackageOption;
  }

  @override
  void update(void Function(TopupPackageOptionBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TopupPackageOption build() => _build();

  _$TopupPackageOption _build() {
    final _$result = _$v ??
        _$TopupPackageOption._(
          amountRupiah: BuiltValueNullFieldError.checkNotNull(
              amountRupiah, r'TopupPackageOption', 'amountRupiah'),
          credits: BuiltValueNullFieldError.checkNotNull(
              credits, r'TopupPackageOption', 'credits'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
